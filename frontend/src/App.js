/**
 * Main App Component
 * This component sets up routing for the entire application
 * All pages are rendered through React Router
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddRide from './pages/AddRide';
import FindMatches from './pages/FindMatches';
import MyRequests from './pages/MyRequests';

// Import context for authentication state
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          {/* Navigation bar - visible on all pages */}
          <Navbar />
          
          {/* Main content area with routes */}
          <main className="flex-grow">
            <Routes>
              {/* Home page - landing page */}
              <Route path="/" element={<Home />} />
              
              {/* Authentication pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected routes - require authentication */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-ride" element={<AddRide />} />
              <Route path="/find-matches" element={<FindMatches />} />
              <Route path="/my-requests" element={<MyRequests />} />
              
              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          {/* Footer - visible on all pages */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
