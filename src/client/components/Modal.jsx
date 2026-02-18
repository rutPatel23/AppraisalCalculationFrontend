import React from 'react'

function Modal({ isOpen, title, children, onClose }) {
  return (
    <div id="modal" aria-hidden={!isOpen} onClick={(e) => {
      if (e.target.id === 'modal') onClose()
    }}>
      <div className="sheet">
        <div className="sheet-head">
          <div id="modal-title">{title}</div>
          <button id="close" type="button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div id="modal-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
