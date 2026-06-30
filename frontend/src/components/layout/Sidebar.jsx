import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  History, 
  FileSpreadsheet, 
  BarChart3, 
  Settings, 
  LogOut,
  User,
  ShieldAlert
} from 'lucide-react';
export function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generator', label: 'Generate Script', icon: Sparkles },
    { id: 'history', label: 'History', icon: History },
    { id: 'templates', label: 'Templates', icon: FileSpreadsheet },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const filteredNavItems = navItems.filter(item => !item.adminOnly || user?.role === 'admin');

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 transition-colors duration-300">
      {/* Brand Logo */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-850 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-200/40 dark:shadow-none">
          M
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
            Manivtha AI
          </h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            Tours & Travels
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">{/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-9 w-9 rounded-lg bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-semibold shrink-0">
              {user?.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="overflow-hidden">
              <h2 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user?.name || 'Staff User'}
              </h2>
              <div className="flex items-center gap-1">
                {user?.role === 'admin' && <ShieldAlert className="w-3 h-3 text-emerald-500" />}
                <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize truncate">
                  {user?.role || 'Staff'}
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={onLogout}
            title="Logout"
            className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
