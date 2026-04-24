import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 3000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const { type, title, message } = toast;
  
  const icons = {
    success: <CheckCircle className="toast-icon toast-icon-success" size={20} />,
    error: <AlertCircle className="toast-icon toast-icon-error" size={20} />,
    warning: <AlertTriangle className="toast-icon toast-icon-warning" size={20} />,
    info: <Info className="toast-icon toast-icon-info" size={20} />
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon-wrapper">
        {icons[type] || icons.info}
      </div>
      <div className="toast-content">
        {title && <h4 className="toast-title">{title}</h4>}
        {message && <p className="toast-message">{message}</p>}
      </div>
      <button className="toast-close" onClick={onRemove}>
        <X size={16} />
      </button>
    </div>
  );
};
