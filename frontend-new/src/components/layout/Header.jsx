import React from 'react';
import { Send } from 'lucide-react';

export const Header = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'generator', label: 'Generator' },
    { id: 'history', label: 'History' },
    { id: 'analytics', label: 'Analytics' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm shadow-slate-100/50">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center">
            <Send className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">Manivtha Upsell AI</h1>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Tours & Travels</span>
          </div>
        </div>
        
        <nav className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
