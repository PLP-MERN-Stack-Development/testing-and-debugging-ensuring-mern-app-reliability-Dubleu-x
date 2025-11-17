// Button.jsx - Add default type attribute
import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  className = '',
  type = 'button', // Add default type
  ...props 
}) => {
  // Inline styles instead of CSS import
  const baseStyle = {
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  };

  const variantStyles = {
    primary: { backgroundColor: '#007bff', color: 'white' },
    secondary: { backgroundColor: '#6c757d', color: 'white' },
    danger: { backgroundColor: '#dc3545', color: 'white' },
  };

  const sizeStyles = {
    sm: { padding: '4px 12px', fontSize: '12px' },
    md: { padding: '8px 16px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '16px' },
  };

  const buttonStyle = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
  };

  return (
    <button 
      style={buttonStyle}
      disabled={disabled}
      onClick={onClick}
      className={className}
      type={type} // Add type attribute
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;