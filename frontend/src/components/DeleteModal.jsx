import React from 'react';

const DeleteModal = ({ item, onClose, onConfirm }) => {
  if (!item) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Confirm Delete</h3>
        <p>
          Are you sure you want to delete{' '}
          <strong>{item.title || 'this item'}</strong>?
        </p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-button">
            Delete
          </button>
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
