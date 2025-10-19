import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';

import UploadImage from './UploadImage';
import DeleteModal from './DeleteModal';

const MusicForm = () => {
  const [musicList, setMusicList] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    link: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [musicToDelete, setMusicToDelete] = useState(null);

  useEffect(() => {
    fetchMusic();
  }, []);

  const fetchMusic = async () => {
    try {
      const res = await axios.get('/api/music');
      setMusicList(res.data);
    } catch (err) {
      console.error('Failed to fetch music', err);
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

      await axios.post('/api/music', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData({ title: '', date: '', description: '', link: '' });
      setImageFile(null);
      setImageUrl('');
      fetchMusic();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save music');
    }
  };

  const openDeleteModal = (music) => {
    setMusicToDelete(music);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!musicToDelete) return;

    try {
      await axios.delete(`/api/music/${musicToDelete._id}`);
      setIsDeleteModalOpen(false);
      setMusicToDelete(null);
      fetchMusic();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete music');
    }
  };

  return (
    <div className="music-form-container">
      <h2>Music</h2>
      <form onSubmit={handleSubmit} className="music-form">
        <input type="text" name="title" placeholder="Title *" value={formData.title} onChange={handleChange} required />
        <input type="text" name="date" placeholder="Date" value={formData.date} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} rows={3} />
        <input type="text" name="link" placeholder="External Link" value={formData.link} onChange={handleChange} />
        <UploadImage existingImageUrl={imageUrl} onFileSelect={handleFileSelect} />
        <button type="submit">Add Music</button>
      </form>

      <div className="music-list">
        {musicList.length === 0 && <p>No music entries found.</p>}
        {musicList.map((music) => (
          <div key={music._id} className="music-item">
            {music.imageUrl && <img src={music.imageUrl} alt={music.title} className="music-image" />}
            <div className="music-info">
              <h3>{music.title}</h3>
              <p>{music.date}</p>
              <p>{music.description}</p>
              {music.link && (
                <a href={music.link} target="_blank" rel="noopener noreferrer">
                  Visit Link
                </a>
              )}
            </div>
            <button onClick={() => openDeleteModal(music)} className="delete-button">Delete</button>
          </div>
        ))}
      </div>

      {isDeleteModalOpen && (
        <DeleteModal
          item={musicToDelete}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default MusicForm;
