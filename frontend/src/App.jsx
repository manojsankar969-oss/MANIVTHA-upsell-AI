import React, { useState, useEffect } from 'react';
import { Plus, Zap, History, BarChart3, Send } from 'lucide-react';

// Custom Hooks
import { useGenerator } from './hooks/useGenerator';
import { useHistory } from './hooks/useHistory';
import { useAnalytics } from './hooks/useAnalytics';

// Services / Utilities
import { downloadScriptPdf } from './utils/pdfGenerator';

// Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Card, CardHeader, CardBody } from './components/ui/Card';
import { GeneratorForm } from './components/generator/GeneratorForm';
import { PresetList } from './components/generator/PresetList';
import { ScriptOutput } from './components/generator/ScriptOutput';
import { FeedbackSection } from './components/generator/FeedbackSection';
import { HistoryTable } from './components/history/HistoryTable';
import { AnalyticsStats } from './components/analytics/AnalyticsStats';
import { RatingDistribution } from './components/analytics/RatingDistribution';

import './App.css';

// Preset configurations
const PRESETS = [
  {
    name: 'Long Stay Upsell',
    staff_name: 'Rahul',
    customer_details: 'Mr. Kapoor (Regular)',
    booking_inputs: 'Booked a Swift (Sedan) for 2 days. Upsell a 5-day outstation package to Hampi with a professional driver.'
  },
  {
    name: 'Premium Upgrade',
    staff_name: 'Anjali',
    customer_details: 'TechCorp Solutions (Corporate)',
    booking_inputs: 'Booked an Innova for airport transfer. Upsell a Toyota Fortuner (Premium SUV) for their 3-day executive city visit for better impression and comfort.'
  },
  {
    name: 'Add-on Service',
    staff_name: 'Suresh',
    customer_details: 'The Smith Family (Tourists)',
    booking_inputs: 'Booked a Tempo Traveller for city tour. Upsell a weekend trip to Srisailam including guide services and premium refreshments package.'
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('generator');

  // Load history data when history tab is active
  const { 
    history, 
    loading: historyLoading, 
    fetchHistory, 
    setHistory 
  } = useHistory();

  // Load analytics data when analytics tab is active
  const { 
    analytics, 
    loading: analyticsLoading, 
    fetchAnalytics 
  } = useAnalytics();

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
    applyPreset,
    generateScript,
    submitFeedback,
    setRating,
    setComment,
    resetGenerator
  } = useGenerator((newRecord) => {
    // Proactively prepend script output record into history list cache
    setHistory(prev => [newRecord, ...prev]);
  });

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab, fetchHistory, fetchAnalytics]);

  // Utility Actions
  const handleCopyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.ai_response);
    alert('✅ Script copied to clipboard!');
  };

  const handleShareResult = () => {
    if (!result) return;
    if (navigator.share) {
      navigator.share({
        title: 'Manivtha Upsell Script',
        text: result.ai_response,
      }).catch(console.error);
    } else {
      handleCopyToClipboard();
    }
  };

  // View specific log history entry in the main Generator panel
  const handleViewRecordFromHistory = (record) => {
    setResult(record);
    applyPreset(record);
    setActiveTab('generator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans gradient-bg">
      {/* Navigation Top Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-4 md:p-6 w-full flex-1 flex flex-col justify-start">
        {/* Error notification bar */}
        {generatorError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-sm font-semibold shadow-sm flex items-center justify-between">
            <span>⚠️ {generatorError}</span>
            <button 
              onClick={resetGenerator} 
              className="text-xs underline hover:text-rose-950 font-bold ml-2"
            >
              Clear error
            </button>
          </div>
        )}

        {/* 1. Generator Tab View */}
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Input Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Main Inputs Card */}
              <Card>
                <CardHeader title="New Script Input" icon={Plus} />
                <CardBody>
                  <GeneratorForm
                    formData={formData}
                    onChange={handleInputChange}
                    onSubmit={generateScript}
                    loading={generatorLoading}
                  />
                </CardBody>
              </Card>

              {/* Quick Presets Card */}
              <Card>
                <CardHeader title="Quick Templates" icon={Zap} />
                <CardBody className="p-4 bg-slate-50/50">
                  <PresetList presets={PRESETS} onApply={applyPreset} />
                </CardBody>
              </Card>
            </div>

            {/* Output Column */}
            <div className="lg:col-span-7">
              {result ? (
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
                <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200 border-dashed py-24 px-8 text-center text-slate-400 min-h-[480px]">
                  <div className="bg-slate-50 p-5 rounded-full mb-5 shadow-sm text-slate-300">
                    <Send className="w-10 h-10 transform rotate-12" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 tracking-tight mb-2">
                    Ready to generate
                  </h3>
                  <p className="text-sm text-slate-500 max-w-[340px] leading-relaxed">
                    Fill out the form on the left or select a template to generate a high-converting customer upsell script.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. History Log Tab View */}
        {activeTab === 'history' && (
          <Card className="shadow-sm">
            <CardHeader title="Generation History" icon={History} />
            <HistoryTable
              history={history}
              loading={historyLoading}
              onViewRecord={handleViewRecordFromHistory}
            />
          </Card>
        )}

        {/* 3. Analytics Dashboard Tab View */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {analyticsLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-2xl">
                <Spinner size="lg" />
                <p className="text-slate-400 text-sm font-medium">Computing analytics data...</p>
              </div>
            ) : (
              <>
                {/* Metric Cards Grid */}
                <AnalyticsStats
                  totalGenerations={analytics?.total_generations}
                  averageRating={analytics?.average_rating}
                />

                {/* Rating Chart Area */}
                <div className="max-w-2xl">
                  <RatingDistribution
                    distribution={analytics?.rating_distribution}
                    total={analytics?.total_generations}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Corporate Page Footer */}
      <Footer />
    </div>
  );
}

export default App;
