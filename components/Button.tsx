
import React from 'react';

interface ButtonProps {
  label: string;
  onClick: (label: string) => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className = '' }) => {
  const isZero = label === '0';
  const baseClasses = `flex items-center text-3xl font-semibold rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black active:opacity-75`;
  
  const sizeClasses = isZero ? 'justify-start px-8' : 'justify-center aspect-square';

  return (
    <button
      onClick={() => onClick(label)}
      className={`${baseClasses} ${sizeClasses} ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
