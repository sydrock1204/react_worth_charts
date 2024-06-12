import React from 'react'

interface ModalProps {
  children: React.ReactNode
  onClose: () => void
  className?: string
}

const Modal: React.FC<ModalProps> = ({ children, onClose, className }) => {
  return (
    <div className={`modal ${className}`}>
      <div className="modal-content">{children}</div>
      <button className="relative modal-close bottom-0" onClick={onClose}>
        Close
      </button>
    </div>
  )
}

export default Modal
