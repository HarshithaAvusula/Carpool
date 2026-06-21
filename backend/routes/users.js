/**
 * Users Routes
 * Handles user profile operations
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * GET /api/users
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

/**
 * GET /api/users/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user' });
  }
});

module.exports = router;