import React from 'react';
import './Button.css';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'btn-full' : '';
  const loadingClass = isLoading ? 'btn-loading' : '';
  
  const classes = [baseClass, variantClass, sizeClass, widthClass, loadingClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button 
      className={classes} 
      disabled={disabled || isLoading} 
      {...props}
    >
      {isLoading && <Loader2 className="btn-spinner" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} />}
      <span className="btn-content" style={{ opacity: isLoading ? 0 : 1 }}>
        {children}
      </span>
    </button>
  );
};

export default Button;
