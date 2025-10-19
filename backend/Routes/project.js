const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const projectsController = require('../controllers/project');
const { authMiddleware } = require('../middleware/Auth'); // Import auth

// Public Routes
router.get('/', projectsController.getAllProjects);
router.get('/:id', projectsController.getProjectById);

// Admin-Protected Routes
router.post('/', authMiddleware, upload.single('image'), projectsController.createProject);
router.put('/:id', authMiddleware, upload.single('image'), projectsController.updateProject);
router.delete('/:id', authMiddleware, projectsController.deleteProject);

module.exports = router;
