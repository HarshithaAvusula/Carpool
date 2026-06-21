const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  rideId: { type: Number, required: true },
  requesterId: { type: Number, required: true },
  requesterName: { type: String, required: true },
  requesterAvatar: { type: String },
  requesterPhone: { type: String },
  driverId: { type: Number, required: true },
  driverName: { type: String, required: true },
  driverAvatar: { type: String },
  driverPhone: { type: String },
  message: { type: String, default: 'I would like to join your ride.' },
  status: { type: String, default: 'pending' },
  // Actual drop/completion time for this passenger
  actualDropTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);