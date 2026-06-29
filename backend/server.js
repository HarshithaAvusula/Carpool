/**
 * Main Server File
 * This is the entry point for the backend server
 * It sets up Express server, middleware, and routes
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import route files














const authRoutes = require('./routes/auth');
const rideRoutes = require('./routes/rides');
const requestRoutes = require('./routes/requests');
const userRoutes = require('./routes/users');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
// CORS allows frontend to communicate with backend
app.use(cors());
// Body parser helps read JSON data from requests
app.use(bodyParser.json());

// Route middleware
// All API routes start with /api
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);

// Root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Hyderabad Carpool API is running!' });
});

// API health route
app.get('/api', (req, res) => {
  res.json({ message: 'Hyderabad Carpool API is running!' });
});

// Connect to MongoDB then start the server
const mongoUri = process.env.MONGODB_URI && process.env.MONGODB_URI.trim();
if (!mongoUri) {
  console.error('Missing MONGODB_URI in backend/.env. Please set it and restart the server.');
  process.exit(1);
}
console.log('Using MongoDB URI:', mongoUri.startsWith('mongodb+srv:') ? 'mongodb+srv://<cluster>' : mongoUri);

mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });