import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm shadow-slate-200/60 dark:shadow-slate-950/40 border border-slate-200 dark:border-slate-800 overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', title, icon: Icon = null, action = null }) => {
  return (
    <div className={`px-6 py-4 border-b border-slate-100 bg-slate-50/80 dark:bg-slate-950/40 flex justify-between items-center ${className}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
        {title ? (
          <h2 className="text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100">{title}</h2>
        ) : (
          children
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export const CardBody = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};
