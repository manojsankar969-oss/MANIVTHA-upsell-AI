import React from 'react';

export const Footer = () => {
  return (
    <footer className="max-w-6xl mx-auto px-6 py-12 text-center mt-auto border-t border-slate-100">
      <p className="text-sm text-slate-400 italic">
        "Increases revenue per booking through intelligent upselling at point of confirmation"
      </p>
      <div className="mt-4 flex justify-center items-center gap-2 text-xs text-slate-300 font-semibold">
        <span>Internship Project</span>
        <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
        <span>Manivtha Tours & Travels</span>
        <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
        <span>Version 2.0 (Modular)</span>
      </div>
    </footer>
  );
};
