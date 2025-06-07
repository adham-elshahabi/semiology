
import React, { useState } from 'react';
import './Modal.css'; // Assume CSS for animations is here

export function Modal({ title, content, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <div>{content}</div>
        <button onClick={onClose} className="modal-close">Close</button>
      </div>
    </div>
  );
}

export function useModals() {
  const [modal, setModal] = useState(null);

  const showModal = (title, content) => {
    setModal({ title, content });
  };

  const ModalRenderer = () =>
    modal ? (
      <Modal title={modal.title} content={modal.content} onClose={() => setModal(null)} />
    ) : null;

  return { showModal, ModalRenderer };
}
