/**
 * RouteCard Component
 * Displays a ride card with ride information
 * Used in Find Matches and Dashboard pages
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const RouteCard = ({ ride, onRequestRide, showRequestButton = true }) => {
  const navigate = useNavigate();

  /**
   * Handle request ride button click
   */
  const handleRequest = () => {
    if (onRequestRide) {
      onRequestRide(ride);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      {/* Driver info */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
          {ride.avatar || 'U'}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{ride.driverName}</h3>
          <p className="text-sm text-gray-500">{ride.office}</p>
        </div>
        {ride.womenOnly && (
          <span className="ml-auto bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-medium">
            Women Only
          </span>
        )}
      </div>

      {/* Route information */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-600">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-green-600">📍</span>
          </div>
          <div>
            <p className="text-xs text-gray-400">From</p>
            <p className="font-medium">{ride.startLocation}</p>
          </div>
        </div>

        <div className="flex items-center text-gray-600">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-red-600">🎯</span>
          </div>
          <div>
            <p className="text-xs text-gray-400">To</p>
            <p className="font-medium">{ride.destination}</p>
          </div>
        </div>

        {ride.viaRoute && (
          <div className="flex items-center text-gray-600">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-purple-600">🛣️</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Via Route</p>
              <p className="font-medium text-sm">{ride.viaRoute}</p>
            </div>
          </div>
        )}

        <div className="flex items-center text-gray-600">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-600">🕐</span>
          </div>
          <div>
            <p className="text-xs text-gray-400">Time</p>
            <p className="font-medium">{ride.time}</p>
          </div>
        </div>

        <div className="flex items-center text-gray-600">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-yellow-600">👥</span>
          </div>
          <div>
            <p className="text-xs text-gray-400">Available Seats</p>
            <p className="font-medium">{ride.availableSeats} seats</p>
          </div>
        </div>
      </div>

      {/* Request button */}
      {showRequestButton && ride.availableSeats > 0 && (
        <button
          onClick={handleRequest}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-green-600 transition font-medium"
        >
          Request to Join
        </button>
      )}

      {ride.availableSeats === 0 && (
        <button
          disabled
          className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg cursor-not-allowed font-medium"
        >
          No Seats Available
        </button>
      )}
    </div>
  );
};

export default RouteCard;
