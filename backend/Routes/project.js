const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const projectsController = require('../controllers/project');
const { authMiddleware } = require('../middleware/Auth');

// Public Routes
router.get('/', projectsController.getAllProjects);
router.get('/:id', projectsController.getProjectById);

// Admin-Protected Routes
router.post('/', authMiddleware, (req, res, next) => {
  // If Content-Type is multipart, use Multer
  if (req.headers['content-type']?.startsWith('multipart/form-data')) {
    upload.single('image')(req, res, next);
  } else {
    next();
  }
}, projectsController.createProject);

router.put('/:id', authMiddleware, (req, res, next) => {
  if (req.headers['content-type']?.startsWith('multipart/form-data')) {
    upload.single('image')(req, res, next);
  } else {
    next();
  }
}, projectsController.updateProject);

router.delete('/:id', authMiddleware, projectsController.deleteProject);

module.exports = router;
