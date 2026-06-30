import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './utils/supabaseClient';

// Custom Hooks
import { useGenerator } from './hooks/useGenerator';
import { useHistory } from './hooks/useHistory';
import { useAnalytics } from './hooks/useAnalytics';

// Services / Utilities
import { api } from './services/api';
import { downloadScriptPdf } from './utils/pdfGenerator';

// Components
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { Login } from './components/auth/Login';
import { Spinner } from './components/ui/Spinner';
import { LoadingSkeleton } from './components/ui/LoadingSkeleton';

// Views
import { Dashboard } from './components/dashboard/Dashboard';
import { GeneratorForm } from './components/generator/GeneratorForm';
import { ScriptOutput } from './components/generator/ScriptOutput';
import { FeedbackSection } from './components/generator/FeedbackSection';
import { PresetList } from './components/generator/PresetList';
import { HistoryTable } from './components/history/HistoryTable';
import { TemplatesPage } from './components/templates/TemplatesPage';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { Settings } from './components/settings/Settings';

import { Sparkles, Send } from 'lucide-react';
import './App.css';

const fetchUserProfile = async (session) => {
  if (!session?.user) return null;
  try {
    const profile = await api.getMe();
    return {
      id: session.user.id,
      email: session.user.email,
      name: profile.name || session.user.user_metadata?.full_name || session.user.email.split('@')[0],
      role: profile.role || 'staff'
    };
  } catch {
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
      role: 'staff'
    };
  }
};

function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'dashboard');
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);

  // 1. Supabase Session Listener
  useEffect(() => {
    let cancelled = false;

    const handleSession = async (session) => {
      setSession(session);
      const profile = await fetchUserProfile(session);
      if (!cancelled) {
        setUser(profile);
        setAuthLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) handleSession(session);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  // Persist active tab
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // 2. Load History Data Hook
  const { 
    history, 
    loading: historyLoading, 
    page,
    total,
    totalPages,
    fetchHistory, 
    setHistory 
  } = useHistory();

  // 3. Load Analytics Data Hook
  const { 
    analytics, 
    loading: analyticsLoading, 
    fetchAnalytics 
  } = useAnalytics();

  // 4. Fetch templates from API
  const fetchTemplates = useCallback(async () => {
    setTemplatesLoading(true);
    try {
      const res = await api.getTemplates();
      setTemplates(res || []);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    } finally {
      setTemplatesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTemplates();
      // Pre-load history for dashboard
      fetchHistory(1);
      // Pre-load analytics
      fetchAnalytics();
    }
  }, [user, fetchTemplates, fetchHistory, fetchAnalytics]);

  // Setup generator hook. Pre-populate history cache if script generates successfully.
  const {
    formData,
    loading: generatorLoading,
    result,
    error: generatorError,
    feedback,
    feedbackSubmitted,
    feedbackLoading,
    setResult,
    handleInputChange,
    setDirectFormValue,
    applyPreset,
    generateScript,
    submitFeedback,
    setRating,
    setComment,
    resetGenerator
  } = useGenerator((newRecord) => {
    // Proactively prepend script output record into history list cache
    setHistory(prev => [newRecord, ...prev]);
    // Refresh analytics
    fetchAnalytics();
  });

  // Automatically update the staff name in generator form when user logs in
  useEffect(() => {
    if (user?.name && !formData.staff_name) {
      setDirectFormValue('staff_name', user.name);
    }
  }, [user, formData.staff_name, setDirectFormValue]);

  // Trigger data refreshes on tab changes
  useEffect(() => {
    if (!user) return;
    if (activeTab === 'history') {
      fetchHistory(1);
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'templates') {
      fetchTemplates();
    }
  }, [activeTab, user, fetchHistory, fetchAnalytics, fetchTemplates]);

  // Utility Actions
  const handleCopyToClipboard = () => {
    if (!result) return;
    const text = result.suggested_script || result.ai_response;
    navigator.clipboard.writeText(text);
    alert('✅ Script copied to clipboard!');
  };

  const handleShareResult = () => {
    if (!result) return;
    const text = result.suggested_script || result.ai_response;
    if (navigator.share) {
      navigator.share({
        title: 'Manivtha Upsell Script',
        text: text,
      }).catch(console.error);
    } else {
      handleCopyToClipboard();
    }
  };

  // View specific log history entry in the main Generator panel
  const handleViewRecordFromHistory = (record) => {
    setResult(record);
    // Apply template structure
    applyPreset({ data: record });
    setActiveTab('generator');
  };

  const handleApplyTemplate = (template) => {
    applyPreset(template);
    setResult(null); // Clear previous outputs to show the form
    setActiveTab('generator');
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      resetGenerator();
      setActiveTab('dashboard');
    }
  };

  // Show loading spinner during initial auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-3">
        <Spinner size="lg" />
        <p className="text-slate-450 dark:text-slate-500 text-sm font-semibold">Verifying secure session...</p>
      </div>
    );
  }

  // Show login page if unauthenticated
  if (!user) {
    return <Login onAuthSuccess={async (_user, session) => {
      setSession(session);
      const profile = await fetchUserProfile(session);
      setUser(profile);
      setAuthLoading(false);
    }} />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* 1. Desktop Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
      />

      {/* 2. Main Content Window */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-20 md:pb-6">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <span className="text-xs font-extrabold tracking-tight text-slate-900 dark:text-white">
              Manivtha AI
            </span>
          </div>
          <span className="bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            {user.role}
          </span>
        </header>

        {/* Content Area */}
        <main className="max-w-5xl mx-auto p-4 md:p-8 w-full flex-1 flex flex-col justify-start">
          
          {/* Global Error Notification */}
          {generatorError && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-150 dark:border-rose-900/35 rounded-xl text-rose-700 dark:text-rose-455 text-xs font-semibold flex items-center justify-between animate-fade-in">
              <span>⚠️ {generatorError}</span>
              <button 
                onClick={resetGenerator} 
                className="text-[10px] underline hover:text-rose-950 dark:hover:text-white font-bold ml-2 uppercase tracking-wider"
              >
                Clear error
              </button>
            </div>
          )}

          {/* Tab Views */}
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <Dashboard 
              user={user} 
              history={history} 
              analytics={analytics} 
              onNavigate={setActiveTab} 
              onViewRecord={handleViewRecordFromHistory} 
            />
          )}

          {/* Generator Tab */}
          {activeTab === 'generator' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Input Form Column (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-805 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-cyan-500 fill-cyan-500/10 animate-pulse" />
                      Upsell Generator
                    </h3>
                    {result && (
                      <button
                        onClick={resetGenerator}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-650 uppercase tracking-wider"
                      >
                        Reset Form
                      </button>
                    )}
                  </div>
                  <GeneratorForm
                    formData={formData}
                    onChange={handleInputChange}
                    onSubmit={generateScript}
                    loading={generatorLoading}
                  />
                </div>
              </div>

              {/* Output Result Column (7 Cols) */}
              <div className="lg:col-span-7">
                {generatorLoading ? (
                  <LoadingSkeleton />
                ) : result ? (
                  <ScriptOutput
                    result={result}
                    onCopy={handleCopyToClipboard}
                    onShare={handleShareResult}
                    onDownloadPdf={() => downloadScriptPdf(result)}
                    onRegenerate={generateScript}
                  >
                    <FeedbackSection
                      rating={feedback.rating}
                      comment={feedback.comment}
                      submitted={feedbackSubmitted}
                      loading={feedbackLoading}
                      onRatingChange={setRating}
                      onCommentChange={setComment}
                      onSubmit={submitFeedback}
                    />
                  </ScriptOutput>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 border-dashed py-24 px-8 text-center text-slate-400 dark:text-slate-550 min-h-[480px] transition-colors">
                    <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl mb-5 shadow-sm text-slate-300 dark:text-slate-700">
                      <Send className="w-10 h-10 transform rotate-12" />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-700 dark:text-slate-300 tracking-tight mb-2">
                      Ready to generate
                    </h3>
                    <p className="text-xs text-slate-450 dark:text-slate-500 max-w-[320px] leading-relaxed font-medium">
                      Fill out the customer booking form on the left or apply a preset template to generate a structured AI upsell script.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Generation History
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 font-semibold">
                  Search, filter, and review all previously generated upsell proposals.
                </p>
              </div>
              <HistoryTable
                history={history}
                loading={historyLoading}
                page={page}
                total={total}
                totalPages={totalPages}
                onViewRecord={handleViewRecordFromHistory}
                onPageChange={fetchHistory}
                onDownloadPdf={downloadScriptPdf}
              />
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <TemplatesPage 
              templates={templates} 
              loading={templatesLoading}
              user={user} 
              onApply={handleApplyTemplate} 
              onRefresh={fetchTemplates} 
            />
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Business Analytics
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 font-semibold">
                  Detailed metrics on script generation volume, rating feedback, and upsell revenue opportunities.
                </p>
              </div>
              <AnalyticsDashboard 
                analytics={analytics} 
                loading={analyticsLoading} 
              />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <Settings 
              user={user} 
              onLogout={handleLogout} 
            />
          )}

        </main>
      </div>

      {/* 3. Mobile Bottom Navigation Bar (Hidden on Desktop) */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
      />

    </div>
  );
}

export default App;
