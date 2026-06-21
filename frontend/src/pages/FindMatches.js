/**
 * Find Matches Page
 * Allows users to search for rides matching their route
 * Displays available rides with filtering options
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import RouteCard from '../components/RouteCard';

const API_URL = 'http://localhost:5000/api';

const FindMatches = () => {
  const { sessionId } = useAuth();
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [womenOnly, setWomenOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch all available rides when component mounts
   */
  useEffect(() => {
    fetchRides();
  }, [sessionId]);

  /**
   * Fetch rides from API
   */
  const fetchRides = async () => {
    try {
      const response = await axios.get(`${API_URL}/rides?sessionId=${sessionId}`);
      setRides(response.data.rides || []);
      setFilteredRides(response.data.rides || []);
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter rides based on search criteria
   */
  useEffect(() => {
    let filtered = [...rides];

    // Filter by women-only preference
    if (womenOnly) {
      filtered = filtered.filter(ride => ride.womenOnly === true);
    }

    // Filter by location search
    if (searchLocation) {
      const searchLower = searchLocation.toLowerCase();
      filtered = filtered.filter(ride =>
        ride.startLocation.toLowerCase().includes(searchLower) ||
        ride.destination.toLowerCase().includes(searchLower) ||
        ride.office.toLowerCase().includes(searchLower)
      );
    }

    setFilteredRides(filtered);
  }, [searchLocation, womenOnly, rides]);

  /**
   * Handle ride request
   */
  const handleRequestRide = async (ride) => {
    const message = prompt('Add a message to the driver (optional):', 'I would like to join your ride.');
    if (message === null) return; // User cancelled

    try {
      await axios.post(`${API_URL}/requests`, {
        sessionId,
        rideId: ride.id,
        message
      });
      alert('Request sent successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Rides</h1>
          <p className="text-gray-600">Search for rides matching your commute route</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search by Location 🔍
              </label>
              <input
                id="search"
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="e.g., Gachibowli, Madhapur"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={womenOnly}
                  onChange={(e) => setWomenOnly(e.target.checked)}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-3 text-sm text-gray-700">Women Only Rides 👩</span>
              </label>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchLocation('');
                  setWomenOnly(false);
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading rides...' : `${filteredRides.length} ride(s) found`}
          </p>
        </div>

        {/* Rides Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-500">Finding rides for you...</p>
          </div>
        ) : filteredRides.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No rides found</h3>
            <p className="text-gray-500 mb-4">
              {searchLocation || womenOnly
                ? 'Try adjusting your filters or search terms'
                : 'No rides available at the moment. Be the first to offer a ride!'}
            </p>
            {!searchLocation && !womenOnly && (
              <a
                href="/add-ride"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-600 transition inline-block"
              >
                Offer a Ride
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRides.map(ride => (
              <RouteCard
                key={ride.id}
                ride={ride}
                onRequestRide={handleRequestRide}
                showRequestButton={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindMatches;
