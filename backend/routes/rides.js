/**
 * Rides Routes
 * Handles creating, viewing, and managing rides
 */

const express = require('express');
const router = express.Router();
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

  // If session.userId is numeric (number or numeric string), return it
  if (typeof session.userId === 'number') return session.userId;
  if (typeof session.userId === 'string' && /^[0-9]+$/.test(session.userId)) return parseInt(session.userId);

  // Otherwise assume it's a legacy ObjectId string; look up user and migrate to numeric id
  try {
    const userByObjectId = await User.findById(session.userId);
    if (!userByObjectId) return null;

    // Ensure user has numeric id
    if (!userByObjectId.id) {
      const lastUser = await User.findOne().sort({ id: -1 });
      const newId = (lastUser && lastUser.id) ? lastUser.id + 1 : 1;
      userByObjectId.id = newId;
      await userByObjectId.save();
    }

    // update session to store numeric id for future
    session.userId = userByObjectId.id;
    await session.save();

    return userByObjectId.id;
  } catch (err) {
    return null;
  }
};

/**
 * GET /api/rides
 */
router.get('/', async (req, res) => {
  try {
    const { sessionId, womenOnly } = req.query;
    
    let query = { status: 'active' };
    
    if (womenOnly === 'true') {
      query.womenOnly = true;
    }
    
    let rides = await Ride.find(query);
    
    if (sessionId) {
      const userId = await getUserIdFromSession(sessionId);
      if (userId) {
        rides = rides.filter(ride => ride.userId !== userId);
      }
    }
    
    res.json({ rides });
  /**
   * POST /api/rides
   */
  router.post('/', async (req, res) => {
    try {
      const { sessionId, startLocation, destination, viaRoute, office, time, date, availableSeats, womenOnly, startTime, estimatedDropTime } = req.body;
    
      // Validate required fields
      if (!sessionId || !startLocation || !destination || !office || !time || !date) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
    
      const userId = await getUserIdFromSession(sessionId);
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
    
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    
      const lastRide = await Ride.findOne().sort({ id: -1 });
      const newId = lastRide ? lastRide.id + 1 : 1;

      const parsedStartTime = startTime ? new Date(startTime) : undefined;
      const parsedEstimatedDrop = estimatedDropTime ? new Date(estimatedDropTime) : undefined;
    
      const newRide = new Ride({
        id: newId,
        userId,
        driverName: user.name,
        startLocation,
        destination,
        viaRoute: viaRoute || '',
        office,
        time,
        date,
        startTime: parsedStartTime,
        estimatedDropTime: parsedEstimatedDrop,
        availableSeats: parseInt(availableSeats),
        womenOnly: womenOnly || false,
        status: 'active',
        avatar: user.avatar
      });
    
      await newRide.save();
    
      res.status(201).json({
        message: 'Ride created successfully',
        ride: newRide
      });
    } catch (error) {
      console.error('Error creating ride:', error);
      res.status(500).json({ message: 'Server error creating ride', error: error.message });
    }
  });
  } catch (error) {
    console.error('Error creating ride:', error);
    res.status(500).json({ message: 'Server error creating ride', error: error.message });
  }
});

/**
 * GET /api/rides/match/:location
 */
router.get('/match/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { sessionId } = req.query;
    
    let query = {
      status: 'active',
      $or: [
        { startLocation: { $regex: location, $options: 'i' } },
        { destination: { $regex: location, $options: 'i' } }
      ]
    };
    
    let matchedRides = await Ride.find(query);
    
    if (sessionId) {
      const userId = await getUserIdFromSession(sessionId);
      if (userId) {
        matchedRides = matchedRides.filter(ride => ride.userId !== userId);
      }
    }
    
    res.json({ rides: matchedRides });
  } catch (error) {
    res.status(500).json({ message: 'Server error finding matches' });
  }
});

/**
 * GET /api/rides/my
 */
router.get('/my', async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    const userId = await getUserIdFromSession(sessionId);
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const myRides = await Ride.find({ userId, status: 'active' });
    
    res.json({ rides: myRides });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user rides' });
  }
});

/**
 * PUT /api/rides/:id/complete
 */
router.put('/:id/complete', async (req, res) => {
  try {
    const { sessionId } = req.query;
    const rideId = parseInt(req.params.id);

    const userId = await getUserIdFromSession(sessionId);
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const ride = await Ride.findOne({ id: rideId });
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to complete this ride' });
    }

    if (ride.status !== 'active') {
      return res.status(400).json({ message: 'Ride is not active' });
    }

    ride.status = 'completed';
    await ride.save();

    res.json({ message: 'Ride marked completed', ride });
  } catch (error) {
    res.status(500).json({ message: 'Server error completing ride', error: error.message });
  }
});

/**
 * GET /api/rides/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findOne({ id: parseInt(req.params.id) });
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    res.json({ ride });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching ride' });
  }
});

/**
 * DELETE /api/rides/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    const userId = await getUserIdFromSession(sessionId);
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const ride = await Ride.findOneAndDelete({ 
      id: parseInt(req.params.id), 
      userId: userId 
    });
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found or unauthorized' });
    }
    
    res.json({ message: 'Ride deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting ride' });
  }
});

module.exports = router;