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
    primary: "bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white shadow-xl shadow-cyan-200/30 focus:ring-cyan-400",
    secondary: "bg-white/85 border border-slate-200 hover:border-cyan-300 text-slate-700 hover:bg-cyan-50 focus:ring-cyan-400",
    premium: "bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-200/30 focus:ring-teal-400",
    dark: "bg-slate-900 hover:bg-slate-800 text-white shadow-md focus:ring-slate-700",
    ghost: "text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 rounded-lg p-2"
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
