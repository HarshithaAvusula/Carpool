/**
 * Authentication Routes
 * Handles user signup and login
 * Simple authentication without password hashing (for demo purposes)
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Session = require('../models/Session');

/**
 * POST /api/auth/signup
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, gender, office } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    const avatar = name.split(' ').length >= 2 
      ? (name.split(' ')[0][0] + name.split(' ')[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
    
    // Generate next user ID
    const lastUser = await User.findOne().sort({ id: -1 });
    const newId = (lastUser && lastUser.id) ? lastUser.id + 1 : 1;
    
    const newUser = new User({
      id: newId,
      name,
      email,
      password,
      phone,
      gender,
      office,
      avatar
    });
    
    await newUser.save();
    
    const sessionId = 'session_' + Date.now();
    const session = new Session({ sessionId, userId: newId });
    await session.save();
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        gender: newUser.gender,
        office: newUser.office,
        avatar: newUser.avatar
      },
      sessionId
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Ensure user has numeric `id` for app-level identities (migrate legacy users)
    if (!user.id && user._id) {
      const lastUser = await User.findOne().sort({ id: -1 });
      const newId = (lastUser && lastUser.id) ? lastUser.id + 1 : 1;
      user.id = newId;
      await user.save();
    }

    const sessionId = 'session_' + Date.now();
    const session = new Session({ sessionId, userId: user.id || user._id.toString() });
    await session.save();

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        office: user.office,
        avatar: user.avatar
      },
      sessionId
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (sessionId) {
      await Session.findOneAndDelete({ sessionId });
    }
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during logout' });
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    if (!sessionId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    let user = null;
    // numeric id stored
    if (typeof session.userId === 'number' || (typeof session.userId === 'string' && /^[0-9]+$/.test(session.userId))) {
      user = await User.findOne({ id: Number(session.userId) });
    }

    // fallback: legacy ObjectId string
    if (!user) {
      try {
        user = await User.findById(session.userId);
        if (user && !user.id) {
          const lastUser = await User.findOne().sort({ id: -1 });
          const newId = (lastUser && lastUser.id) ? lastUser.id + 1 : 1;
          user.id = newId;
          await user.save();
          session.userId = newId;
          await session.save();
        }
      } catch (err) {
        // ignore cast errors, user stays null
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        office: user.office,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;