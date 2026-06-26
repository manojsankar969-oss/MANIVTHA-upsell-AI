import React from 'react';

export const Spinner = ({ size = 'md', color = 'indigo', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  const colors = {
    indigo: 'border-indigo-600/30 border-t-indigo-600',
    white: 'border-white/30 border-t-white',
    slate: 'border-slate-300 border-t-slate-600',
  };

  return (
    <div
      className={`animate-spin rounded-full ${sizes[size] || sizes.md} ${colors[color] || colors.indigo} ${className}`}
      role="status"
      aria-label="loading"
    />
  );
};
