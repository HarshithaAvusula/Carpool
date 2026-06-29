/**
 * Authentication Context
 * This context manages user authentication state across the application
 * It provides login, logout, and user data to all components
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext(null);

// API base URL - set this in deployment with REACT_APP_API_URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * AuthProvider Component
 * Wraps the application to provide auth context to all children
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  // Check for existing session on app load
  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      verifySession(storedSessionId);
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Verify if session is still valid
   */
  const verifySession = async (sid) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me?sessionId=${sid}`);
      if (response.data.user) {
        setUser(response.data.user);
        setSessionId(sid);
      }
    } catch (error) {
      // Session invalid, clear it
      localStorage.removeItem('sessionId');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login function
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      if (response.data.user && response.data.sessionId) {
        setUser(response.data.user);
        setSessionId(response.data.sessionId);
        localStorage.setItem('sessionId', response.data.sessionId);
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  /**
   * Signup function
   * @param {object} userData - User registration data
   */
  const signup = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, userData);
      
      if (response.data.user && response.data.sessionId) {
        setUser(response.data.user);
        setSessionId(response.data.sessionId);
        localStorage.setItem('sessionId', response.data.sessionId);
        return { success: true };
      }
      return { success: false, message: 'Signup failed' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      if (sessionId) {
        await axios.post(`${API_URL}/auth/logout`, { sessionId });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setSessionId(null);
      localStorage.removeItem('sessionId');
    }
  };

  /**
   * Context value object
   * Provides all auth-related functions and state
   */
  const value = {
    user,
    sessionId,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 * Makes it easy to access auth state in any component
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
