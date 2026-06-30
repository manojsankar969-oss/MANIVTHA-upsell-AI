import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Play, 
  Sparkles,
  Plane,
  Map,
  Heart,
  Briefcase,
  Compass,
  Crown,
  X,
  Save
} from 'lucide-react';
import { api } from '../../services/api';

const getTemplateIcon = (name) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('airport') || nameLower.includes('transfer')) return Plane;
  if (nameLower.includes('weekend') || nameLower.includes('hill')) return Map;
  if (nameLower.includes('wedding')) return Heart;
  if (nameLower.includes('corporate') || nameLower.includes('business')) return Briefcase;
  if (nameLower.includes('outstation') || nameLower.includes('temple')) return Compass;
  if (nameLower.includes('luxury') || nameLower.includes('tourist')) return Crown;
  return Sparkles;
};

export function TemplatesPage({ templates, loading, user, onApply, onRefresh }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form states for new template
  const [templateForm, setTemplateForm] = useState({
    customerName: '',
    destination: '',
    travelDate: '',
    tripDuration: '',
    budget: 'Medium',
    vehicleType: 'Sedan',
    numPassengers: '1',
    purpose: 'Tourism',
    luxuryLevel: 'Premium',
    specialRequests: '',
    addons: [],
    currentPackage: '',
    currentVehicle: '',
    currentPrice: '',
    currentAddons: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemplateForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddonClick = (addonId) => {
    setTemplateForm(prev => {
      const current = prev.addons || [];
      const updated = current.includes(addonId) 
        ? current.filter(id => id !== addonId)
        : [...current, addonId];
      return { ...prev, addons: updated };
    });
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;

    setSaving(true);
    setError(null);

    try {
      await api.createTemplate({
        name: newTemplateName.trim(),
        data: templateForm
      });
      
      setNewTemplateName('');
      setShowCreateModal(false);
      onRefresh(); // Refresh templates list
    } catch (err) {
      console.error('Failed to create template:', err);
      setError(err.message || 'Failed to create template.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (id, e) => {
    e.stopPropagation(); // Prevent trigger "Use Template"
    if (!window.confirm('Are you sure you want to delete this template?')) return;

    try {
      await api.deleteTemplate(id);
      onRefresh(); // Refresh templates list
    } catch (err) {
      alert(`Error deleting template: ${err.message}`);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Preset Templates
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 font-medium">
            Select a preset template to quickly pre-fill the script generation form.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-97"
          >
            <Plus className="w-4 h-4" />
            <span>Create Template</span>
          </button>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-semibold text-slate-400">Loading templates...</p>
            </div>
          </div>
        ) : templates.length === 0 ? (
          <div className="col-span-full text-center py-16 text-slate-400 dark:text-slate-500 font-medium text-xs">
            No templates found. {isAdmin ? 'Create one to get started.' : ''}
          </div>
        ) : templates.map((template) => {
          const Icon = getTemplateIcon(template.name);
          const data = template.data || {};
          
          return (
            <div
              key={template.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-5 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-sm transition-all group"
            >
              <div className="space-y-3">
                {/* Icon & Title */}
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 rounded-xl border border-cyan-100/10 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {isAdmin && (
                    <button
                      onClick={(e) => handleDeleteTemplate(template.id, e)}
                      title="Delete Template"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/25 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {template.name}
                  </h3>
                  <div className="text-[10px] text-slate-500 dark:text-slate-450 font-medium mt-1.5 space-y-1">
                    <p>📍 Destination: <span className="font-bold">{data.destination || 'N/A'}</span></p>
                    <p>🚗 Vehicle Class: <span className="font-bold">{data.vehicleType || 'N/A'}</span></p>
                    <p>💼 Purpose: <span className="font-bold">{data.purpose || 'N/A'}</span></p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onApply(template)}
                className="w-full py-2 bg-slate-50 hover:bg-cyan-50 dark:bg-slate-850 dark:hover:bg-cyan-950/30 text-slate-700 hover:text-cyan-650 dark:text-slate-300 dark:hover:text-cyan-400 border border-slate-100 dark:border-slate-800/80 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-99"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Use Template</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Create Template Modal (Admin Only) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-xl max-h-[85vh] overflow-y-auto flex flex-col p-6 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-wider">
                Create New Preset Template
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-650 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-150 dark:border-rose-900/40 rounded-xl text-rose-750 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleCreateTemplate} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Template Name *</label>
                <input
                  type="text"
                  required
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g. Hyderabad Heritage Luxury Tour"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Destination</label>
                  <input
                    type="text"
                    name="destination"
                    value={templateForm.destination}
                    onChange={handleInputChange}
                    placeholder="e.g. Srisailam"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={templateForm.vehicleType}
                    onChange={handleInputChange}
                    placeholder="e.g. SUV"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Trip Duration</label>
                  <input
                    type="text"
                    name="tripDuration"
                    value={templateForm.tripDuration}
                    onChange={handleInputChange}
                    placeholder="e.g. 2 Days"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Trip Purpose</label>
                  <input
                    type="text"
                    name="purpose"
                    value={templateForm.purpose}
                    onChange={handleInputChange}
                    placeholder="e.g. Tourism"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <h4 className="font-bold text-slate-800 dark:text-white mb-2">Current Booking Fallback</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Package</label>
                    <input
                      type="text"
                      name="currentPackage"
                      value={templateForm.currentPackage}
                      onChange={handleInputChange}
                      placeholder="e.g. Swift Rental"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Vehicle</label>
                    <input
                      type="text"
                      name="currentVehicle"
                      value={templateForm.currentVehicle}
                      onChange={handleInputChange}
                      placeholder="e.g. Swift"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">Price</label>
                    <input
                      type="text"
                      name="currentPrice"
                      value={templateForm.currentPrice}
                      onChange={handleInputChange}
                      placeholder="e.g. 3000"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-cyan-100 dark:shadow-none"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Template'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
export default TemplatesPage;
