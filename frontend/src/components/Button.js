/**
 * Button Component
 * Reusable button component with different variants
 * Used throughout the application for consistent button styling
 */

import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false,
  className = '',
  fullWidth = false 
}) => {
  // Base classes for all buttons
  const baseClasses = 'px-6 py-3 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-green-600 focus:ring-green-500',
    secondary: 'bg-secondary text-white hover:bg-blue-600 focus:ring-blue-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    outline: 'border-2 border-primary text-primary hover:bg-green-50 focus:ring-green-500',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
  };

  // Disabled state
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  // Full width
  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${widthClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
