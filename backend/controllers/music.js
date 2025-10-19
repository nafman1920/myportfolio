const Music = require('../Models/music');

// Create music
exports.createMusic = async (req, res) => {
  try {
    const { title, date, description, link } = req.body;
    let imageUrl = '';
    if (req.file) {
      // Use the Cloudinary URL here
      imageUrl = req.file.path; // or req.file.secure_url if available
    }

    const newMusic = new Music({
      title,
      date,
      description,
      imageUrl,
      link,
    });
    await newMusic.save();
    res.status(201).json(newMusic);
  } catch (err) {
    console.error('Error createMusic:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all music
exports.getAllMusic = async (req, res) => {
  try {
    const music = await Music.find().sort({ createdAt: -1 });
    res.json(music);
  } catch (err) {
    console.error('Error getAllMusic:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get specific music
exports.getMusicById = async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) return res.status(404).json({ message: 'Not found' });
    res.json(music);
  } catch (err) {
    console.error('Error getMusicById:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update music
exports.updateMusic = async (req, res) => {
  try {
    const { title, date, description, link } = req.body;
    const updates = { title, date, description, link };
    if (req.file) {
      // Use Cloudinary URL here as well
      updates.imageUrl = req.file.path;
    }
    const updated = await Music.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Error updateMusic:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete music
exports.deleteMusic = async (req, res) => {
  try {
    await Music.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleteMusic:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
