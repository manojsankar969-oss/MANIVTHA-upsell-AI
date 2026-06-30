import React, { useState } from 'react';
import { 
  User, 
  Key, 
  Settings as SettingsIcon, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  Sparkles,
  Shield,
  Save,
  LogOut
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../utils/supabaseClient';

export function Settings({ user, onLogout }) {
  const { theme, setTheme } = useTheme();
  
  // Password Reset State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match.');
    }

    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      const { error: updateErr } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (updateErr) throw updateErr;

      setSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-cyan-500" />
          Settings & Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 font-medium">
          Manage your account profile, change security keys, and customize the application theme.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column - Profile & Preferences */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 transition-colors shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-500" />
              Your Profile Info
            </h3>
            
            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
              <div className="h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-lg">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Staff Member'}</h4>
                <p className="text-xs text-slate-450 dark:text-slate-500 truncate mt-0.5">{user?.email}</p>
              </div>
              <span className="bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-cyan-100/30">
                {user?.role || 'Staff'}
              </span>
            </div>
          </div>

          {/* Theme Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 transition-colors shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-500" />
              Application Theme
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'system'].map((mode) => {
                const isSelected = theme === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setTheme(mode)}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 capitalize select-none transition-all ${
                      isSelected
                        ? 'bg-cyan-50/40 dark:bg-cyan-950/20 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-semibold shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-450 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs font-semibold">{mode}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* System Status Indicators */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 transition-colors shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-500" />
              System Status
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-emerald-500" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Supabase Connection</h4>
                    <p className="text-[9px] text-slate-400 dark:text-slate-550 font-semibold">Authentication & Database</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-455 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Gemini AI Engine</h4>
                    <p className="text-[9px] text-slate-400 dark:text-slate-550 font-semibold">Gemini 2.5 Flash Model</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping"></span>
                  Active
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Change Password */}
        <div className="md:col-span-5">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 transition-colors shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-500" />
              Update Password
            </h3>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-150 dark:border-rose-900/40 rounded-xl flex items-start gap-2 text-rose-700 dark:text-rose-455 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 dark:border-emerald-900/40 rounded-xl flex items-start gap-2 text-emerald-700 dark:text-emerald-455 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs shadow-md shadow-cyan-100 dark:shadow-none transition-all active:scale-99 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{loading ? 'Saving...' : 'Change Password'}</span>
              </button>
            </form>
          </div>

          {/* Quick Logout Card */}
          <div className="mt-6">
            <button
              onClick={onLogout}
              className="w-full py-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/10 dark:hover:bg-rose-950/20 text-rose-650 dark:text-rose-455 border border-rose-200/40 dark:border-rose-900/30 font-bold rounded-2xl text-xs transition-all active:scale-99 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
export default Settings;
