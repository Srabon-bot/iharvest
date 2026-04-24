import React from 'react';
import { Loader2 } from 'lucide-react';
import './Loader.css';

export const Spinner = ({ size = 24, className = '' }) => {
  return (
    <Loader2 
      className={`spinner ${className}`} 
      size={size} 
    />
  );
};

export const Skeleton = ({ className = '', style }) => {
  return (
    <div className={`skeleton ${className}`} style={style} />
  );
};

export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="page-loader">
      <Spinner size={32} className="page-loader-icon" />
      {message && <p className="page-loader-text">{message}</p>}
    </div>
  );
};
