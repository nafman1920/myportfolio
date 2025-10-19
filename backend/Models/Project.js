const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String }, // or Date type if you prefer
  description: String,
  imageUrl: String, // store path or URL to uploaded image
  link: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
