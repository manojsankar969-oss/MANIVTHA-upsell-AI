import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, Sparkles } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

export function Login({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('manivtha-remember-email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (rememberMe) {
        localStorage.setItem('manivtha-remember-email', email);
      } else {
        localStorage.removeItem('manivtha-remember-email');
      }

      if (isSignUp) {
        // Sign Up flow
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (signUpErr) throw signUpErr;

        // Note: In Supabase, if email confirmation is enabled, the session might be null initially.
        // We'll handle both cases gracefully.
        if (data?.session) {
          onAuthSuccess(data.user, data.session);
        } else {
          setSuccessMsg('Registration successful! Please check your email for verification.');
          setIsSignUp(false);
        }
      } else {
        // Login flow
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInErr) throw signInErr;

        if (data?.user && data?.session) {
          onAuthSuccess(data.user, data.session);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100 dark:shadow-none transition-all duration-300">
        
        {/* Header / Brand */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-100 dark:shadow-none mb-4">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            AI Trip Package Upsell
          </h2>
          <p className="mt-1 text-sm text-slate-550 dark:text-slate-400 font-semibold">
            Manivtha Tours & Travels
          </p>
        </div>

        {/* Form Toggle Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => { setIsSignUp(false); setError(null); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              !isSignUp 
                ? 'bg-white dark:bg-slate-750 text-cyan-600 dark:text-white shadow-sm' 
                : 'text-slate-650 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsSignUp(true); setError(null); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              isSignUp 
                ? 'bg-white dark:bg-slate-750 text-cyan-600 dark:text-white shadow-sm' 
                : 'text-slate-650 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-150 dark:border-rose-900/40 rounded-xl flex items-start gap-3 text-rose-700 dark:text-rose-455 text-sm font-semibold animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 dark:border-emerald-900/40 rounded-xl flex items-start gap-3 text-emerald-700 dark:text-emerald-455 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Core Auth Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Manoj Sankar"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-950 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-950 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => alert('Please contact your administrator to reset your password.')}
                  className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-950 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Submit */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-sm text-slate-650 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-500 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-sm shadow-md shadow-cyan-100 dark:shadow-none hover:shadow-lg focus:outline-none transition-all duration-200 active:scale-99 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
