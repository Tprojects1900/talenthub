import React from 'react';

const Loader = ({ size = 'md', color = 'text-orange-600' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`animate-spin rounded-full border-t-transparent border-current ${color} ${sizeClasses[size] || sizeClasses.md}`} role="status">
        <span className="sr-only">Chargement...</span>
      </div>
    </div>
  );
};

export default Loader;