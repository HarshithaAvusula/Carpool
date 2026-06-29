/**
 * My Requests Page
 * Shows ride requests sent by user and requests received for user's rides
 * Allows accepting, rejecting, and cancelling requests
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Toast from '../components/Toast';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const MyRequests = () => {
  const { sessionId } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [myCompletedRequests, setMyCompletedRequests] = useState([]);
  const [receivedCompletedRequests, setReceivedCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const prevCompletedRef = useRef({ my: 0, received: 0 });

  const addToast = (message, timeout = 6000) => {
    const id = Date.now() + Math.random();
    setToasts(ts => [{ id, message }, ...ts]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), timeout);
  };

  /**
   * Fetch requests when component mounts
   */
  useEffect(() => {
    fetchRequests();
  }, [sessionId]);

  /**
   * Fetch all requests from API
   */
  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/requests?sessionId=${sessionId}`);
      setMyRequests(response.data.myRequests || []);
      setReceivedRequests(response.data.receivedRequests || []);
      setMyCompletedRequests(response.data.myCompletedRequests || []);
      setReceivedCompletedRequests(response.data.receivedCompletedRequests || []);

      // Show toasts for newly completed requests since last fetch
      const prev = prevCompletedRef.current;
      const newMyCompleted = (response.data.myCompletedRequests || []).length;
      const newReceivedCompleted = (response.data.receivedCompletedRequests || []).length;

      if (newMyCompleted > prev.my) {
        const delta = newMyCompleted - prev.my;
        addToast(`${delta} of your request(s) completed`);
      }
      if (newReceivedCompleted > prev.received) {
        const delta = newReceivedCompleted - prev.received;
        addToast(`${delta} ride(s) you drove completed`);
      }

      prevCompletedRef.current = { my: newMyCompleted, received: newReceivedCompleted };
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Accept a ride request
   */
  const handleAccept = async (requestId) => {
    try {
      const response = await axios.put(`${API_URL}/requests/${requestId}/accept?sessionId=${sessionId}`);
      fetchRequests(); // Refresh requests

      // Show contact info and route details
      const { contactInfo, rideDetails, rideTimes } = response.data;
      const startTimeText = (rideTimes && rideTimes.startTime) ? new Date(rideTimes.startTime).toLocaleString() : (rideDetails.startTime ? new Date(rideDetails.startTime).toLocaleString() : 'N/A');
      const estimatedDropText = (rideTimes && rideTimes.estimatedDropTime) ? new Date(rideTimes.estimatedDropTime).toLocaleString() : (rideDetails.estimatedDropTime ? new Date(rideDetails.estimatedDropTime).toLocaleString() : 'N/A');
      const message = `
Request accepted successfully!

📞 Contact Information:
- ${contactInfo.requesterName}: ${contactInfo.requesterPhone}
- ${contactInfo.driverName}: ${contactInfo.driverPhone}

🚗 Ride Details:
- From: ${rideDetails.startLocation}
- To: ${rideDetails.destination}
- Via: ${rideDetails.viaRoute}
- Office: ${rideDetails.office}
- Date: ${rideDetails.date}
- Time: ${rideDetails.time}
     - Planned Start: ${startTimeText}
     - Estimated Drop: ${estimatedDropText}

Please contact each other to coordinate pickup location!
      `;
      alert(message);
    } catch (error) {
      alert('Failed to accept request');
    }
  };

  /**
   * Reject a ride request
   */
  const handleReject = async (requestId) => {
    try {
      await axios.put(`${API_URL}/requests/${requestId}/reject?sessionId=${sessionId}`);
      fetchRequests(); // Refresh requests
      alert('Request rejected');
    } catch (error) {
      alert('Failed to reject request');
    }
  };

  const handleReached = async (requestId) => {
    try {
      const response = await axios.put(`${API_URL}/requests/${requestId}/reached?sessionId=${sessionId}`);
      fetchRequests();
      // show a toast for driver immediately
      if (response.data.rideCompleted) {
        addToast('Ride finished — all passengers dropped.');
      } else {
        addToast('Passenger dropped. Ride still active for others.');
      }
    } catch (error) {
      console.error('Error marking reached:', error);
      alert('Failed to mark destination reached');
    }
  };

  /**
   * Cancel a sent request
   */
  const handleCancel = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/requests/${requestId}?sessionId=${sessionId}`);
      fetchRequests(); // Refresh requests
      alert('Request cancelled');
    } catch (error) {
      alert('Failed to cancel request');
    }
  };

  /**
   * Get status badge color
   */
  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Toast container */}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} onClose={() => setToasts(ts => ts.filter(x => x.id !== t.id))} />
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Requests</h1>
          <p className="text-gray-600">Manage ride requests you've sent and received</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-500">Loading requests...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Requests Received (for driver) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Requests Received ({receivedRequests.length})
              </h2>
              
              {receivedRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No requests received yet
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedRequests.map(request => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                            {request.requesterAvatar}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{request.requesterName}</h3>
                            <p className="text-sm text-gray-600">{request.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(request.createdAt).toLocaleString()}
                            </p>
                            {request.rideStartTime && (
                              <p className="text-xs text-gray-500 mt-1">Planned start: {new Date(request.rideStartTime).toLocaleString()}</p>
                            )}
                            {request.rideEstimatedDropTime && (
                              <p className="text-xs text-gray-500">Estimated drop: {new Date(request.rideEstimatedDropTime).toLocaleString()}</p>
                            )}
                            {request.status === 'accepted' && request.requesterPhone && (
                              <div className="mt-2 p-2 bg-green-50 rounded-lg">
                                <p className="text-sm font-medium text-green-800">
                                  📞 Phone: {request.requesterPhone}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                          
                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAccept(request.id)}
                                className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {request.status === 'accepted' && (
                            <button
                              onClick={() => handleReached(request.id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition"
                            >
                              Mark destination reached
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Requests Sent (by user) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Requests Sent ({myRequests.length})
              </h2>
              
              {myRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No requests sent yet. <a href="/find-matches" className="text-primary hover:underline">Find rides</a>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRequests.map(request => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">Ride #{request.rideId}</h3>
                          {request.driverName && (
                            <p className="text-sm text-gray-600">Driver: {request.driverName}</p>
                          )}
                          <p className="text-sm text-gray-600">{request.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Requested on {new Date(request.createdAt).toLocaleString()}
                          </p>
                            {request.rideStartTime && (
                              <p className="text-xs text-gray-500 mt-1">Planned start: {new Date(request.rideStartTime).toLocaleString()}</p>
                            )}
                            {request.rideEstimatedDropTime && (
                              <p className="text-xs text-gray-500">Estimated drop: {new Date(request.rideEstimatedDropTime).toLocaleString()}</p>
                            )}
                          {request.status === 'accepted' && request.driverPhone && (
                            <div className="mt-2 p-2 bg-green-50 rounded-lg">
                              <p className="text-sm font-medium text-green-800">
                                📞 Driver Phone: {request.driverPhone}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                          
                          {request.status === 'pending' && (
                            <button
                              onClick={() => handleCancel(request.id)}
                              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(myCompletedRequests.length > 0 || receivedCompletedRequests.length > 0) && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Completed Rides</h2>

                {myCompletedRequests.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Your completed ride requests</h3>
                    <div className="space-y-4">
                      {myCompletedRequests.map(request => (
                        <div key={request.id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">Ride #{request.rideId}</h3>
                              <p className="text-sm text-gray-600">Driver: {request.driverName}</p>
                              <p className="text-sm text-green-800 mt-1">Ride completed. Driver reached destination.</p>
                              {request.actualDropTime && (
                                <p className="text-xs text-gray-500 mt-1">Dropped at {new Date(request.actualDropTime).toLocaleString()}</p>
                              )}
                              {request.rideActualEndTime && (
                                <p className="text-xs text-gray-500">Ride ended at {new Date(request.rideActualEndTime).toLocaleString()}</p>
                              )}
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {receivedCompletedRequests.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Completed rides you drove</h3>
                    <div className="space-y-4">
                      {receivedCompletedRequests.map(request => (
                        <div key={request.id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">Ride #{request.rideId}</h3>
                              <p className="text-sm text-gray-600">Passenger: {request.requesterName}</p>
                                <p className="text-sm text-green-800 mt-1">Ride completed. Passenger notified.</p>
                                {request.actualDropTime && (
                                  <p className="text-xs text-gray-500 mt-1">Dropped at {new Date(request.actualDropTime).toLocaleString()}</p>
                                )}
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
