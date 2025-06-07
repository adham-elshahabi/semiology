
import React, { createContext, useState, useContext } from 'react';
import { Modal } from './Modal';
import { Rotate3D, MousePointerClick, Search, Moon, RefreshCw } from 'lucide-react';

const ModalContext = createContext();

export function useModals() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  const showModal = (title, content) => {
    setModal({ title, content });
  };

  const hideModal = () => setModal(null);

  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}
      {modal && <Modal title={modal.title} content={modal.content} onClose={hideModal} />}
    </ModalContext.Provider>
  );
}