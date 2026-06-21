/**
 * Home Page (Landing Page)
 * Main landing page with hero section, features, and call-to-action
 * Designed to attract users and explain the Hyderabad traffic problem
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Share Your Ride,
              <span className="text-primary"> Reduce Traffic</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Hyderabad's traffic is among the worst in India. Connect with coworkers 
              from nearby offices and share your daily commute. Save money, reduce pollution, 
              and make new friends along the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/signup"
                    className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition shadow-lg"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/find-matches"
                    className="bg-white text-primary border-2 border-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition"
                  >
                    Find Rides
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition shadow-lg"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Hyderabad Traffic Problem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every day, thousands of employees drive alone to tech parks in Gachibowli, Madhapur, 
              and Hi-Tech City, contributing to massive traffic congestion.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-primary mb-2">2+ hrs</div>
              <p className="text-gray-600">Average commute time in Hyderabad</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-primary mb-2">70%</div>
              <p className="text-gray-600">Cars have only one person during peak hours</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-primary mb-2">₹5000+</div>
              <p className="text-gray-600">Monthly fuel cost per commuter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple steps to start carpooling with your coworkers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Sign Up</h3>
              <p className="text-gray-600 text-center">
                Create your profile with your office location and commute details
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚗</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Add Your Ride</h3>
              <p className="text-gray-600 text-center">
                Offer seats in your car or find rides that match your route
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Connect & Share</h3>
              <p className="text-gray-600 text-center">
                Request rides, accept requests, and start carpooling
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits of Carpooling</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Save Money</h3>
                <p className="text-gray-600 text-sm">Split fuel and parking costs with coworkers</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🌍</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Reduce Pollution</h3>
                <p className="text-gray-600 text-sm">Fewer cars mean less carbon footprint</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⏰</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Save Time</h3>
                <p className="text-gray-600 text-sm">Use HOV lanes and avoid traffic congestion</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Network</h3>
                <p className="text-gray-600 text-sm">Meet professionals from nearby companies</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-primary to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Carpooling?</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Hyderabad commuters who are already sharing rides and making a difference.
          </p>
          {!isAuthenticated ? (
            <Link
              to="/signup"
              className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg inline-block"
            >
              Sign Up Now - It's Free
            </Link>
          ) : (
            <Link
              to="/add-ride"
              className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg inline-block"
            >
              Add Your First Ride
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
