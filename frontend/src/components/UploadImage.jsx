import React, { useState, useEffect } from 'react';

const UploadImage = ({ existingImageUrl, onFileSelect }) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(existingImageUrl || null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    // If existingImageUrl changes externally, update preview
    setPreview(existingImageUrl || null);
    setFile(null);
  }, [existingImageUrl]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      onFileSelect(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      onFileSelect(selectedFile);
    }
  };

  return (
    <div
      className={`upload-area ${dragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('upload-input').click()}
      style={{ cursor: 'pointer' }}
    >
      {preview ? (
        <img src={preview} alt="Preview" className="upload-preview" />
      ) : (
        <p>Drag & Drop an image here or click to upload</p>
      )}

      <input
        id="upload-input"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadImage;
