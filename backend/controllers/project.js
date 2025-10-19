const Project = require('../Models/project');

// Create a project
exports.createProject = async (req, res) => {
  try {
    const { title, date, description, link } = req.body;
    let imageUrl = '';
    if (req.file) {
      // Use Cloudinary URL
      imageUrl = req.file.path;  // or req.file.secure_url if available
    }

    const newProject = new Project({
      title,
      date,
      description,
      imageUrl,
      link,
    });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Error in createProject:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Error getAllProjects:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) {
    console.error('Error getProjectById:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { title, date, description, link } = req.body;
    const updates = { title, date, description, link };
    if (req.file) {
      // Use Cloudinary URL here too
      updates.imageUrl = req.file.path;
    }
    const updated = await Project.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Error updateProject:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleteProject:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
