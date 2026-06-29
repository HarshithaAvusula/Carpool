/**
 * Add Ride Page
 * Allows users to create a new ride offering
 * Collects route details, timing, and seat availability
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const AddRide = () => {
  const { user, sessionId } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startLocation: '',
    destination: '',
    viaRoute: '',
    office: user?.office || '',
    time: '',
    date: new Date().toISOString().split('T')[0],
    // optional ISO datetime strings
    startTime: '',
    estimatedDropTime: '',
    availableSeats: 1,
    womenOnly: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        sessionId,
        startLocation: formData.startLocation,
        destination: formData.destination,
        viaRoute: formData.viaRoute,
        office: formData.office,
        time: formData.time,
        date: formData.date,
        availableSeats: formData.availableSeats,
        womenOnly: formData.womenOnly
      };

      if (formData.startTime) payload.startTime = new Date(formData.startTime).toISOString();
      if (formData.estimatedDropTime) payload.estimatedDropTime = new Date(formData.estimatedDropTime).toISOString();

      const response = await axios.post(`${API_URL}/rides`, payload);

      if (response.data.ride) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Ride</h1>
          <p className="text-gray-600">Offer seats in your car and help reduce Hyderabad traffic</p>
        </div>

        {/* Add Ride Form */}
        <div className="bg-white rounded-xl shadow-md p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="startLocation" className="block text-sm font-medium text-gray-700 mb-2">
                Start Location 📍
              </label>
              <input
                id="startLocation"
                name="startLocation"
                type="text"
                required
                value={formData.startLocation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="e.g., Kukatpally, Madhapur, Secunderabad"
              />
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                Destination 🎯
              </label>
              <input
                id="destination"
                name="destination"
                type="text"
                required
                value={formData.destination}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="e.g., Infosys, Gachibowli"
              />
            </div>

            <div>
              <label htmlFor="viaRoute" className="block text-sm font-medium text-gray-700 mb-2">
                Via Route (Optional) 🛣️
              </label>
              <input
                id="viaRoute"
                name="viaRoute"
                type="text"
                value={formData.viaRoute}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="e.g., KPHB → Miyapur → JNTU → Hitech City"
              />
              <p className="text-xs text-gray-500 mt-1">Specify the path you will take (optional)</p>
            </div>

            <div>
              <label htmlFor="office" className="block text-sm font-medium text-gray-700 mb-2">
                Office Name 🏢
              </label>
              <input
                id="office"
                name="office"
                type="text"
                required
                value={formData.office}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="e.g., Infosys, Gachibowli"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date 📅
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Departure Time 🕐
                </label>
                <input
                  id="time"
                  name="time"
                  type="time"
                  required
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Planned Start (optional)
                </label>
                <input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="estimatedDropTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Drop Time (optional)
                </label>
                <input
                  id="estimatedDropTime"
                  name="estimatedDropTime"
                  type="datetime-local"
                  value={formData.estimatedDropTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700 mb-2">
                Available Seats 👥
              </label>
              <select
                id="availableSeats"
                name="availableSeats"
                required
                value={formData.availableSeats}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              >
                <option value={1}>1 Seat</option>
                <option value={2}>2 Seats</option>
                <option value={3}>3 Seats</option>
                <option value={4}>4 Seats</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                id="womenOnly"
                name="womenOnly"
                type="checkbox"
                checked={formData.womenOnly}
                onChange={handleChange}
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="womenOnly" className="ml-3 text-sm text-gray-700">
                Women Only Ride 👩
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-green-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Ride...' : 'Create Ride'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Tips for a Great Carpool Experience</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Be punctual - respect everyone's time</li>
            <li>• Keep the car clean and comfortable</li>
            <li>• Communicate clearly about pickup points</li>
            <li>• Follow traffic rules and drive safely</li>
            <li>• Be friendly and respectful to fellow commuters</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddRide;
