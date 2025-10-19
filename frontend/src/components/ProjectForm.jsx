import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import UploadImage from './UploadImage';
import DeleteModal from './DeleteModal';

const ProjectForm = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    link: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file) => {
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      alert('Title is required');
      return;
    }

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('date', formData.date);
      payload.append('description', formData.description);
      payload.append('link', formData.link);
      if (imageFile) payload.append('image', imageFile);

      await axios.post('/api/projects', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData({ title: '', date: '', description: '', link: '' });
      setImageFile(null);
      setImageUrl('');
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save project');
    }
  };

  const openDeleteModal = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      await axios.delete(`/api/projects/${projectToDelete._id}`);
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project');
    }
  };

  return (
    <div className="project-form-container">
      <h2>Projects</h2>
      <form onSubmit={handleSubmit} className="project-form">
        <input type="text" name="title" placeholder="Title *" value={formData.title} onChange={handleChange} required />
        <input type="text" name="date" placeholder="Date" value={formData.date} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} rows={3} />
        <input type="text" name="link" placeholder="External Link" value={formData.link} onChange={handleChange} />
        <UploadImage existingImageUrl={imageUrl} onFileSelect={handleFileSelect} />
        <button type="submit">Add Project</button>
      </form>

      <div className="projects-list">
        {projects.length === 0 && <p>No projects found.</p>}
        {projects.map((project) => (
          <div key={project._id} className="project-item">
            {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="project-image" />}
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.date}</p>
              <p>{project.description}</p>
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  Visit Link
                </a>
              )}
            </div>
            <button onClick={() => openDeleteModal(project)} className="delete-button">Delete</button>
          </div>
        ))}
      </div>

      {isDeleteModalOpen && (
        <DeleteModal
          item={projectToDelete}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default ProjectForm;
