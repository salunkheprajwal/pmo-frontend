'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    if (isOpen) {
      modalElement.showModal();
    } else {
      modalElement.close();
    }
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialogElement = modalRef.current;
    if (dialogElement && event.target === dialogElement) {
      onClose();
    }
  };

  return (
    <dialog
      ref={modalRef}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      className="backdrop:bg-black/50 bg-transparent p-0 rounded-lg shadow-xl max-w-2xl w-full 
                 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0"
    >
      <div className="bg-surface rounded-lg max-h-[90vh] overflow-y-auto">
        {title && (
          <div className="flex justify-between items-center px-6 py-4 border-b border-default sticky top-0 bg-surface z-10">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="text-muted-2 hover:text-foreground text-2xl leading-none transition-colors"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </dialog>
  );
}
