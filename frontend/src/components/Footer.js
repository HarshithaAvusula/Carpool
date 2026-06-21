/**
 * Footer Component
 * Footer displayed at the bottom of all pages
 * Contains links, copyright, and future scope information
 */

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Hyderabad Carpool</h3>
            <p className="text-gray-400 text-sm">
              Connecting Hyderabad office commuters to reduce traffic and make daily commute easier.
              Share rides, save money, and help the environment.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-primary transition">Home</a></li>
              <li><a href="/find-matches" className="hover:text-primary transition">Find Rides</a></li>
              <li><a href="/add-ride" className="hover:text-primary transition">Offer a Ride</a></li>
              <li><a href="/login" className="hover:text-primary transition">Login</a></li>
            </ul>
          </div>

          {/* Future scope */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Future Scope</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>✓ Real-time GPS tracking</li>
              <li>✓ In-app payments</li>
              <li>✓ Rating system</li>
              <li>✓ Route optimization</li>
              <li>✓ Corporate partnerships</li>
              <li>✓ Women-only ride preferences</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Hyderabad Carpool. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ for Hyderabad commuters</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
