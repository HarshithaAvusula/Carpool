/**
 * Requests Routes
 * Handles ride requests (requesting to join, accepting, rejecting)
 */

const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Ride = require('../models/Ride');
const User = require('../models/User');
const Session = require('../models/Session');

/**
 * Helper to get user ID from session
 */
const getUserIdFromSession = async (sessionId) => {
  if (!sessionId) return null;
  const session = await Session.findOne({ sessionId });
  if (!session) return null;

  // numeric
  if (typeof session.userId === 'number') return session.userId;
  if (typeof session.userId === 'string' && /^[0-9]+$/.test(session.userId)) return parseInt(session.userId);

  // legacy ObjectId: find user, migrate id
  try {
    const userByObjectId = await User.findById(session.userId);
    if (!userByObjectId) return null;
    if (!userByObjectId.id) {
      const lastUser = await User.findOne().sort({ id: -1 });
      const newId = (lastUser && lastUser.id) ? lastUser.id + 1 : 1;
      userByObjectId.id = newId;
      await userByObjectId.save();
    }
    session.userId = userByObjectId.id;
    await session.save();
    return userByObjectId.id;
  } catch (err) {
    return null;
  }
};

/**
 * GET /api/requests
 */
router.get('/', async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    const userId = await getUserIdFromSession(sessionId);
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const activeRides = await Ride.find({ status: 'active' });
    const activeRideIds = activeRides.map(ride => ride.id);

    const myRequests = await Request.find({ requesterId: userId, status: { $in: ['pending', 'accepted'] }, rideId: { $in: activeRideIds } });
    const myCompletedRequests = await Request.find({ requesterId: userId, status: 'completed' });
    
    const myRides = await Ride.find({ userId: userId, status: 'active' });
    const rideIds = myRides.map(ride => ride.id);
    const receivedRequests = await Request.find({ rideId: { $in: rideIds }, status: { $in: ['pending', 'accepted'] } });
    
    const allUserRides = await Ride.find({ userId });
    const allRideIds = allUserRides.map(ride => ride.id);
    const receivedCompletedRequests = await Request.find({ rideId: { $in: allRideIds }, status: 'completed' });
    // Attach ride time metadata to requests for richer UI without extra roundtrips
    const allRequestRideIds = new Set();
    [myRequests, receivedRequests, myCompletedRequests, receivedCompletedRequests].forEach(list => {
      list.forEach(r => allRequestRideIds.add(r.rideId));
    });
    const rideIdsArr = Array.from(allRequestRideIds);
    const rides = await Ride.find({ id: { $in: rideIdsArr } });
    const rideMap = {};
    rides.forEach(r => { rideMap[r.id] = r; });

    const attachRideTimes = (reqList) => reqList.map(r => {
      const ride = rideMap[r.rideId];
      return Object.assign({}, r.toObject(), {
        rideStartTime: ride ? ride.startTime : null,
        rideEstimatedDropTime: ride ? ride.estimatedDropTime : null,
        rideActualEndTime: ride ? ride.actualEndTime : null
      });
    });

    res.json({
      myRequests: attachRideTimes(myRequests),
      receivedRequests: attachRideTimes(receivedRequests),
      myCompletedRequests: attachRideTimes(myCompletedRequests),
      receivedCompletedRequests: attachRideTimes(receivedCompletedRequests)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching requests' });
  }
});

/**
 * POST /api/requests
 */
router.post('/', async (req, res) => {
  try {
    const { sessionId, rideId, message } = req.body;
    
    const userId = await getUserIdFromSession(sessionId);
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const ride = await Ride.findOne({ id: parseInt(rideId) });
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    if (ride.userId === userId) {
      return res.status(400).json({ message: 'Cannot request your own ride' });
    }
    
    const existingRequest = await Request.findOne({ 
      rideId: parseInt(rideId), 
      requesterId: userId 
    });
    // allow re-requesting if previous request was rejected
    if (existingRequest && existingRequest.status !== 'rejected') {
      return res.status(400).json({ message: 'Already requested this ride' });
    }
    
    const lastRequest = await Request.findOne().sort({ id: -1 });
    const newId = (lastRequest && lastRequest.id) ? lastRequest.id + 1 : 1;

    // Find requester and driver by numeric id
    const user = await User.findOne({ id: userId });
    const driver = await User.findOne({ id: ride.userId });

    // If not found, try legacy ObjectId lookups
    if (!user) {
      try { user = await User.findById(userId); } catch (e) { /* ignore */ }
    }
    if (!driver) {
      try { driver = await User.findById(ride.userId); } catch (e) { /* ignore */ }
    }
    
    const newRequest = new Request({
      id: newId,
      rideId: parseInt(rideId),
      requesterId: userId,
      requesterName: user.name,
      requesterAvatar: user.avatar,
      requesterPhone: user.phone,
      driverId: ride.userId,
      driverName: driver.name,
      driverAvatar: driver.avatar,
      driverPhone: driver.phone,
      message: message || 'I would like to join your ride.',
      status: 'pending'
    });
    
    await newRequest.save();
    
    res.status(201).json({
      message: 'Request sent successfully',
      request: newRequest
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Server error creating request', error: error.message });
  }
});

/**
 * PUT /api/requests/:id/accept
 */
router.put('/:id/accept', async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    const userId = await getUserIdFromSession(sessionId);
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const request = await Request.findOne({ id: parseInt(req.params.id) });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    const ride = await Ride.findOne({ id: request.rideId });
    if (!ride || ride.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }
    
    request.status = 'accepted';
    await request.save();
    
    if (ride.availableSeats > 0) {
      ride.availableSeats -= 1;
      await ride.save();
    }
    
    const requester = await User.findOne({ id: request.requesterId }) || await (async () => { try { return await User.findById(request.requesterId); } catch(e){return null;} })();
    const driver = await User.findOne({ id: request.driverId }) || await (async () => { try { return await User.findById(request.driverId); } catch(e){return null;} })();
    
    res.json({ 
      message: 'Request accepted successfully', 
      request,
      contactInfo: {
        requesterPhone: requester.phone,
        driverPhone: driver.phone,
        requesterName: requester.name,
        driverName: driver.name
      },
      rideDetails: {
        startLocation: ride.startLocation,
        destination: ride.destination,
        viaRoute: ride.viaRoute || 'Direct route',
        office: ride.office,
        time: ride.time,
        date: ride.date
      }
      ,
      rideTimes: {
        startTime: ride.startTime,
        estimatedDropTime: ride.estimatedDropTime,
        actualEndTime: ride.actualEndTime
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error accepting request' });
  }
});

/**
 * PUT /api/requests/:id/reached
 */
router.put('/:id/reached', async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    const userId = await getUserIdFromSession(sessionId);
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const request = await Request.findOne({ id: parseInt(req.params.id) });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    const ride = await Ride.findOne({ id: request.rideId });
    if (!ride || ride.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to complete this ride' });
    }
    
    if (ride.status !== 'active') {
      return res.status(400).json({ message: 'Ride is not active' });
    }

    // Mark only this passenger as completed (dropped)
    request.status = 'completed';
    request.actualDropTime = new Date();
    await request.save();

    // If ride startTime isn't set (not provided during creation), set it when the first passenger is dropped
    if (!ride.startTime) {
      ride.startTime = new Date();
    }

    // Check if there are any remaining accepted passengers
    const remainingAccepted = await Request.countDocuments({ rideId: ride.id, status: 'accepted' });
    let rideCompleted = false;
    if (remainingAccepted === 0) {
      // No more accepted passengers -> ride fully complete
      ride.status = 'completed';
      ride.actualEndTime = new Date();
      rideCompleted = true;
    }

    await ride.save();
    
    const requester = await User.findOne({ id: request.requesterId }) || await (async () => { try { return await User.findById(request.requesterId); } catch (e) { return null; } })();
    const driver = await User.findOne({ id: ride.userId }) || await (async () => { try { return await User.findById(ride.userId); } catch (e) { return null; } })();
    
    res.json({
      message: 'Request marked completed',
      notification: 'Passenger has been notified that the driver reached the destination.',
      request,
      rideCompleted,
      contactInfo: {
        requesterPhone: requester?.phone,
        driverPhone: driver?.phone,
        requesterName: requester?.name,
        driverName: driver?.name
      },
      rideDetails: {
        startLocation: ride.startLocation,
        destination: ride.destination,
        viaRoute: ride.viaRoute || 'Direct route',
        office: ride.office,
        time: ride.time,
        date: ride.date,
        startTime: ride.startTime,
        estimatedDropTime: ride.estimatedDropTime,
        actualEndTime: ride.actualEndTime
      }
    });
  } catch (error) {
    console.error('Error completing ride:', error);
    res.status(500).json({ message: 'Server error completing ride', error: error.message });
  }
});

/**
 * PUT /api/requests/:id/reject
 */
router.put('/:id/reject', async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    const userId = await getUserIdFromSession(sessionId);
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const request = await Request.findOne({ id: parseInt(req.params.id) });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    const ride = await Ride.findOne({ id: request.rideId });
    if (!ride || ride.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }
    
    request.status = 'rejected';
    await request.save();
    
    res.json({ message: 'Request rejected successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error rejecting request' });
  }
});

/**
 * DELETE /api/requests/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    const userId = await getUserIdFromSession(sessionId);
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const request = await Request.findOne({ 
      id: parseInt(req.params.id), 
      requesterId: userId 
    });
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found or unauthorized' });
    }
    
    if (request.status === 'accepted') {
      const ride = await Ride.findOne({ id: request.rideId });
      if (ride) {
        ride.availableSeats += 1;
        await ride.save();
      }
    }
    
    await Request.deleteOne({ id: parseInt(req.params.id) });
    
    res.json({ message: 'Request cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error cancelling request' });
  }
});

module.exports = router;