import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  }, [onClose, id]);
  
  useEffect(() => {
    // Show toast with animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto hide toast
    const hideTimer = setTimeout(() => {
      handleClose();
    }, duration);


    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, handleClose]);



  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill text-success';
      case 'error':
        return 'bi-exclamation-triangle-fill text-danger';
      case 'warning':
        return 'bi-exclamation-circle-fill text-warning';
      case 'info':
        return 'bi-info-circle-fill text-info';
      default:
        return 'bi-info-circle-fill text-info';
    }
  };

  const getBgClass = () => {
    switch (type) {
      case 'success':
        return 'bg-light border-success';
      case 'error':
        return 'bg-light border-danger';
      case 'warning':
        return 'bg-light border-warning';
      case 'info':
        return 'bg-light border-info';
      default:
        return 'bg-light border-info';
    }
  };

  return (
    <div
      className={`toast-notification ${isVisible ? 'show' : ''} ${isLeaving ? 'leaving' : ''}`}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px',
        maxWidth: '400px',
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease-in-out',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div className={`card ${getBgClass()}`}>
        <div className="card-body p-3">
          <div className="d-flex align-items-start">
            <div className="flex-shrink-0 me-3">
              <i className={`bi ${getIcon()} fs-4`}></i>
            </div>
            <div className="flex-grow-1">
              <h6 className="card-title mb-1 fw-semibold">{title}</h6>
              {message && (
                <p className="card-text mb-0 text-muted small">{message}</p>
              )}
            </div>
            <div className="flex-shrink-0">
              <button
                type="button"
                className="btn-close btn-close-sm"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
  }>;
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            position: 'relative',
            marginBottom: '10px',
            transform: `translateY(${index * 10}px)`,
            zIndex: 9999 - index
          }}
        >
          <Toast
            {...toast}
            onClose={onRemove}
          />
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
