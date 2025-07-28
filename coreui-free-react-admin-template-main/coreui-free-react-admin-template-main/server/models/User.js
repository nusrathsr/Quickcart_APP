const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // 👈 make it optional
  },
  // optionally add a field to track signup method
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  address: { type: String, default: "" },
  phone: { type: String, default: "" }
});

module.exports = mongoose.model('User', UserSchema);
