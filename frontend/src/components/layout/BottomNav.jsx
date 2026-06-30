import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  History, 
  FileSpreadsheet, 
  BarChart3,
  Settings 
} from 'lucide-react';

export function BottomNav({ activeTab, setActiveTab, user }) {
  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: History },
    { id: 'generator', label: 'Generate', icon: Sparkles, isFloating: true },
    { id: 'templates', label: 'Templates', icon: FileSpreadsheet },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ].filter(item => !item.adminOnly || user?.role === 'admin');

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 pb-safe">
      <div className="flex items-center justify-around h-16 px-2 relative">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.isFloating) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center -translate-y-4 relative"
              >
                <div className={`h-14 w-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-90 ${
                  isActive 
                    ? 'bg-cyan-600 shadow-cyan-200 dark:shadow-none' 
                    : 'bg-slate-900 dark:bg-slate-700 shadow-slate-200 dark:shadow-none'
                }`}>
                  <Icon className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${
                isActive 
                  ? 'text-cyan-600 dark:text-cyan-400' 
                  : 'text-slate-400 dark:text-slate-550 hover:text-slate-650'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-1 leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
