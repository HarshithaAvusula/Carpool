const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  office: { type: String, required: true },
  avatar: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);