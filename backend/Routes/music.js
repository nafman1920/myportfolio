const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const musicController = require('../controllers/music');
const { authMiddleware } = require('../middleware/Auth');

// Public Routes
router.get('/', musicController.getAllMusic);
router.get('/:id', musicController.getMusicById);

// Admin-Protected Routes
router.post('/', authMiddleware, (req, res, next) => {
  if (req.headers['content-type']?.startsWith('multipart/form-data')) {
    upload.single('image')(req, res, next);
  } else {
    next();
  }
}, musicController.createMusic);

router.put('/:id', authMiddleware, (req, res, next) => {
  if (req.headers['content-type']?.startsWith('multipart/form-data')) {
    upload.single('image')(req, res, next);
  } else {
    next();
  }
}, musicController.updateMusic);

router.delete('/:id', authMiddleware, musicController.deleteMusic);

module.exports = router;
