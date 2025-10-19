const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  // You can store the hashed password here, but it's not required now
  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  }
});

// NOTE: No password hashing middleware or compare method needed
// Authentication is done via .env-based logic

module.exports = mongoose.model('Admin', adminSchema);
