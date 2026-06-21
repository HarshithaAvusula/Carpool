const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  userId: { type: Number, required: true },
  driverName: { type: String, required: true },
  startLocation: { type: String, required: true },
  destination: { type: String, required: true },
  viaRoute: { type: String, default: '' },
  office: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  // Optional planned start time and estimated drop time (ISO dates)
  startTime: { type: Date },
  estimatedDropTime: { type: Date },
  // Actual end time when the ride has fully completed
  actualEndTime: { type: Date },
  availableSeats: { type: Number, required: true },
  womenOnly: { type: Boolean, default: false },
  status: { type: String, default: 'active' },
  avatar: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);