const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String },
  description: String,
  imageUrl: String,
  link: String, // link to external music (Spotify, SoundCloud, etc.)
}, {
  timestamps: true
});

module.exports = mongoose.model('Music', musicSchema);
