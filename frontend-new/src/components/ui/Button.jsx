import React from 'react';
import { Spinner } from './Spinner';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon: Icon = null,
  ...props
}) => {
  const baseStyle = "flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 focus:ring-indigo-500",
    secondary: "bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500",
    dark: "bg-slate-900 hover:bg-slate-800 text-white shadow-md focus:ring-slate-700",
    ghost: "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg p-2"
  };

  const finalClassName = `${variant === 'ghost' ? '' : baseStyle} ${variants[variant] || variants.primary} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={finalClassName}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="sm" color={variant === 'secondary' ? 'slate' : 'white'} />
          {children}
        </>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};
