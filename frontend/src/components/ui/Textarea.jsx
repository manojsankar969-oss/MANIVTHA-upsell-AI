import React from 'react';

export const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  rows = 4,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-semibold text-slate-700 tracking-tight"
        >
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 placeholder-slate-400 bg-white resize-none"
        {...props}
      />
    </div>
  );
};
