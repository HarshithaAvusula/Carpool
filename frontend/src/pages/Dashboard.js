/**
 * Dashboard Page
 * Main dashboard for logged-in users
 * Shows user's rides, quick stats, and navigation to other features
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import RouteCard from '../components/RouteCard';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const Dashboard = () => {
  const { user, sessionId } = useAuth();
  const [myRides, setMyRides] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch user's rides when component mounts
   */
  useEffect(() => {
    fetchMyRides();
  }, [sessionId]);

  /**
   * Fetch rides created by the current user
   */
  const fetchMyRides = async () => {
    try {
      const response = await axios.get(`${API_URL}/rides/my?sessionId=${sessionId}`);
      setMyRides(response.data.rides || []);
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle ride deletion
   */
  const handleDeleteRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to delete this ride?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/rides/${rideId}?sessionId=${sessionId}`);
      setMyRides(myRides.filter(ride => ride.id !== rideId));
    } catch (error) {
      console.error('Error deleting ride:', error);
      alert('Failed to delete ride');
    }
  };

  const handleCompleteRide = async (rideId) => {
    if (!window.confirm('Mark this ride as completed? It will disappear from active rides for you and joiners.')) {
      return;
    }

    try {
      await axios.put(`${API_URL}/rides/${rideId}/complete?sessionId=${sessionId}`);
      setMyRides(myRides.filter(ride => ride.id !== rideId));
    } catch (error) {
      console.error('Error completing ride:', error);
      alert('Failed to complete ride');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your carpool rides and find matches from your dashboard
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🚗</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">My Rides</p>
                <p className="text-2xl font-bold text-gray-900">{myRides.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">💺</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Seats Offered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myRides.reduce((sum, ride) => sum + ride.availableSeats, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🏢</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Office</p>
                <p className="text-lg font-bold text-gray-900 truncate">{user?.office}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/add-ride"
            className="bg-gradient-to-r from-primary to-green-600 rounded-xl shadow-md p-6 text-white hover:shadow-lg transition"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">➕</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Add New Ride</h3>
                <p className="text-green-100">Offer seats in your car</p>
              </div>
            </div>
          </Link>

          <Link
            to="/find-matches"
            className="bg-gradient-to-r from-secondary to-blue-600 rounded-xl shadow-md p-6 text-white hover:shadow-lg transition"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🔍</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Find Matches</h3>
                <p className="text-blue-100">Search for rides on your route</p>
              </div>
            </div>
          </Link>
        </div>

        {/* My Rides Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Rides</h2>
            <Link
              to="/add-ride"
              className="text-primary hover:text-green-600 font-medium"
            >
              + Add New Ride
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-gray-500">Loading your rides...</p>
            </div>
          ) : myRides.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚗</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No rides yet</h3>
              <p className="text-gray-500 mb-4">Start by adding your first ride</p>
              <Link
                to="/add-ride"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
              >
                Add Your First Ride
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRides.map(ride => (
                <div key={ride.id} className="relative">
                  <RouteCard ride={ride} showRequestButton={false} />
                  <div className="absolute top-2 right-2 flex flex-col space-y-2">
                    <button
                      onClick={() => handleCompleteRide(ride.id)}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                      title="Complete ride"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => handleDeleteRide(ride.id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      title="Delete ride"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Request Management Link */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📨</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Requests</h3>
                <p className="text-gray-500 text-sm">View and respond to ride requests</p>
              </div>
            </div>
            <Link
              to="/my-requests"
              className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              View Requests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
