/**
 * Navbar Component
 * Navigation bar displayed at the top of all pages
 * Shows different links based on authentication status
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle logout
   * Logs out user and redirects to home
   */
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">HC</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Hyderabad Carpool</span>
            </Link>
          </div>

          {/* Navigation links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary transition">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary transition">
                  Dashboard
                </Link>
                <Link to="/add-ride" className="text-gray-600 hover:text-primary transition">
                  Add Ride
                </Link>
                <Link to="/find-matches" className="text-gray-600 hover:text-primary transition">
                  Find Matches
                </Link>
                <Link to="/my-requests" className="text-gray-600 hover:text-primary transition">
                  My Requests
                </Link>
                
                {/* User avatar and logout */}
                <div className="flex items-center space-x-3 ml-4">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.avatar || 'U'}
                  </div>
                  <span className="text-gray-700">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary transition">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
