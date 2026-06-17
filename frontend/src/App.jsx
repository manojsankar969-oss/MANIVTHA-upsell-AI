import React, { useState, useEffect } from 'react';
import { 
  Send, 
  History, 
  BarChart3, 
  Copy, 
  Download, 
  RotateCcw, 
  Star, 
  ThumbsUp, 
  ThumbsDown,
  Loader2,
  CheckCircle2,
  Plus,
  FileText,
  Share2,
  Zap
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5002/api';

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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    staff_name: '',
    customer_details: '',
    booking_inputs: ''
  });

  // Feedback state
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: ''
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE}/history`);
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/analytics`);
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const applyPreset = (preset) => {
    setFormData({
      staff_name: preset.staff_name,
      customer_details: preset.customer_details,
      booking_inputs: preset.booking_inputs
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setResult(null);
    setFeedbackSubmitted(false);
    setFeedback({ rating: 0, comment: '' });

    try {
      const response = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error generating script:', err);
      alert('Failed to generate script. Please check if the backend is running and Gemini API key is set.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (feedback.rating === 0) return;

    try {
      await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generation_id: result.id,
          rating: feedback.rating,
          comment: feedback.comment
        })
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.ai_response);
    alert('Copied to clipboard!');
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Manivtha Upsell Script',
        text: result.ai_response,
      }).catch(console.error);
    } else {
      copyToClipboard();
    }
  };

  const downloadAsTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([result.ai_response], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `upsell_script_${result.id}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const downloadAsPdf = () => {
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(result.ai_response, 180);
    
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.text('Manivtha Tours & Travels', 15, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text('AI Generated Upsell Script', 15, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(`Staff: ${result.staff_name} | Date: ${new Date(result.created_at).toLocaleDateString()}`, 15, 38);
    
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.line(15, 42, 195, 42);
    
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85); // Slate 700
    doc.text(splitText, 15, 50);
    
    doc.save(`upsell_script_${result.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Send className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Manivtha Upsell AI</h1>
          </div>
          <nav className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'generator' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Generator
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              History
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Analytics
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <section className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-600" />
                    New Generation
                  </h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Staff Member Name</label>
                    <input 
                      type="text"
                      name="staff_name"
                      value={formData.staff_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Customer Details</label>
                    <input 
                      type="text"
                      name="customer_details"
                      value={formData.customer_details}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="e.g. Mr. Sharma, Corporate Client"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Booking & Inputs</label>
                    <textarea 
                      name="booking_inputs"
                      value={formData.booking_inputs}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-32 resize-none"
                      placeholder="Describe the current booking and what to upsell (e.g. booked a Sedan for 2 days, upsell an SUV for 4 days package)..."
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Script...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Generate Upsell Script
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Presets */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Quick Templates
                  </h2>
                </div>
                <div className="p-4 grid grid-cols-1 gap-3">
                  {PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => applyPreset(preset)}
                      className="text-left p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
                    >
                      <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600">{preset.name}</p>
                      <p className="text-xs text-slate-400 truncate">{preset.booking_inputs}</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Output Section */}
            <section className="space-y-6">
              {result ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      AI Generated Script
                    </h2>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={copyToClipboard}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Copy text"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={downloadAsPdf}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Download PDF"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={shareResult}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={handleSubmit}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Regenerate"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100 min-h-[300px]">
                      {result.ai_response}
                    </div>

                    {/* Feedback Section */}
                    {!feedbackSubmitted ? (
                      <div className="mt-8 pt-8 border-t border-slate-100">
                        <h3 className="text-sm font-medium text-slate-500 mb-4 text-center">How was this response?</h3>
                        <div className="flex justify-center gap-3 mb-6">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                              className={`p-2 rounded-lg transition-all ${feedback.rating >= star ? 'text-amber-400 bg-amber-50' : 'text-slate-300 hover:text-slate-400'}`}
                            >
                              <Star className={`w-8 h-8 ${feedback.rating >= star ? 'fill-current' : ''}`} />
                            </button>
                          ))}
                        </div>
                        {feedback.rating > 0 && (
                          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                            <textarea
                              value={feedback.comment}
                              onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-20 resize-none text-sm"
                              placeholder="Any comments to improve this? (Optional)"
                            />
                            <button 
                              onClick={handleFeedbackSubmit}
                              className="w-full bg-slate-900 text-white text-sm font-semibold py-2 rounded-lg hover:bg-slate-800 transition-all"
                            >
                              Submit Feedback
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-100 text-center animate-in zoom-in-95">
                        <p className="text-green-700 font-medium flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          Thank you for your feedback!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200 border-dashed p-12 text-center text-slate-400">
                  <div className="bg-slate-50 p-4 rounded-full mb-4">
                    <Send className="w-12 h-12 opacity-20" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-600 mb-2">Ready to generate</h3>
                  <p className="text-sm max-w-[280px]">Fill out the form on the left to create a high-converting upsell script for your customer.</p>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'history' && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                Generation History
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Staff</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Preview</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.length > 0 ? history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">{item.staff_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.customer_details}</td>
                      <td className="px-6 py-4 text-sm text-slate-400 truncate max-w-[200px]">{item.ai_response}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {
                            setResult(item);
                            setActiveTab('generator');
                          }}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                        >
                          View Script
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                        No history found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'analytics' && (
          <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500 mb-1">Total Generations</p>
                <p className="text-3xl font-bold text-slate-900">{analytics?.total_generations || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500 mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-slate-900">{Number(analytics?.average_rating || 0).toFixed(1)} / 5.0</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-indigo-600">
                <BarChart3 className="w-8 h-8 mb-2" />
                <p className="text-sm font-medium">Quality Metrics Active</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8">
              <h3 className="text-lg font-semibold mb-6">Rating Distribution</h3>
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = parseInt(analytics?.rating_distribution?.find(r => parseInt(r.rating) === rating)?.count || 0);
                  const percentage = analytics?.total_generations > 0 ? (count / analytics.total_generations) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-8">
                        <span className="text-sm font-medium text-slate-600">{rating}</span>
                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                      </div>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-400 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-12 text-center">
        <p className="text-sm text-slate-400 italic">"Increases revenue per booking through intelligent upselling at point of confirmation"</p>
        <div className="mt-4 flex justify-center items-center gap-2 text-xs text-slate-300">
          <span>Internship Project</span>
          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
          <span>Manivtha Tours & Travels</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
