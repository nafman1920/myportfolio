const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const musicController = require('../controllers/music');
const { authMiddleware } = require('../middleware/Auth'); // import auth

// Public Routes
router.get('/', musicController.getAllMusic);
router.get('/:id', musicController.getMusicById);

// Admin-Protected Routes
router.post('/', authMiddleware, upload.single('image'), musicController.createMusic);
router.put('/:id', authMiddleware, upload.single('image'), musicController.updateMusic);
router.delete('/:id', authMiddleware, musicController.deleteMusic);

module.exports = router;
