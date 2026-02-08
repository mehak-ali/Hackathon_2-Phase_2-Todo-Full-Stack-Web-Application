// frontend/src/components/Modal.tsx
import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling background
    } else {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden transition-all transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-text">{title}</h3>
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
        {footer && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-right">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
