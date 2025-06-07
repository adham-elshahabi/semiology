
import React from 'react';
import './Modal.css';

export function Modal({ title, content, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{title}</h2>
        <div>{content}</div>
        <button onClick={onClose} className="modal-close">Close</button>
      </div>
    </div>
  );
}
