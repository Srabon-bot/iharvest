import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const widthClass = fullWidth ? 'input-full' : '';
  const errorClass = error ? 'input-error' : '';
  const iconClass = Icon ? 'input-with-icon' : '';

  return (
    <div className={`input-container ${widthClass} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {Icon && (
          <div className="input-icon">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input-field ${errorClass} ${iconClass}`}
          {...props}
        />
      </div>
      {error && (
        <span className="input-error-msg">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
