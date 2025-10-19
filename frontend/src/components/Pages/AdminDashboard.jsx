import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProjectForm from '../ProjectForm';
import MusicForm from '../MusicForm';
import UploadImage from '../UploadImage';
import DeleteModal from '../DeleteModal';
import '../Styles/Admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [previewData, setPreviewData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    navigate('/admin/login');
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    const endpoint =
      activeTab === 'projects'
        ? `/api/projects/${itemToDelete._id}`
        : `/api/music/${itemToDelete._id}`;

    try {
      await axios.delete(endpoint, { withCredentials: true });
      alert(`${itemToDelete.title} deleted successfully`);
      setItemToDelete(null);
      setShowDeleteModal(false);
      setPreviewData(null);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete item.');
    }
  };

  return (
    <div className="page-background">
      <div className="admin-dashboard-container">
        <h2>Admin Dashboard</h2>
        <button onClick={logout} className="logout-button">Logout</button>

        <div className="tabs">
          <button
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => setActiveTab('projects')}
          >
            Manage Projects
          </button>
          <button
            className={activeTab === 'music' ? 'active' : ''}
            onClick={() => setActiveTab('music')}
          >
            Manage Music
          </button>
        </div>

        <UploadImage />

        {previewData && (
          <div className="preview-section">
            <h3>Preview</h3>
            <div className="preview-card">
              <h4>{previewData.title || previewData.name}</h4>
              <p>{previewData.description}</p>
              <button className="delete-button" onClick={() => openDeleteModal(previewData)}>
                Delete
              </button>
            </div>
          </div>
        )}

        <div className="tab-content">
          {activeTab === 'projects' ? <ProjectForm /> : <MusicForm />}
        </div>

        {showDeleteModal && (
          <DeleteModal
            item={itemToDelete}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
