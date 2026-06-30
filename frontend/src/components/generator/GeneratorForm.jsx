import React from 'react';
import { Send, User, MapPin, Calendar, Clock, Sparkles, AlertCircle } from 'lucide-react';

export const GeneratorForm = ({ formData, onChange, onSubmit, loading }) => {
  const purposes = ['Tourism', 'Family', 'Business', 'Wedding', 'Corporate', 'Outstation'];
  const budgets = ['Low', 'Medium', 'High'];
  const luxuryLevels = ['Basic', 'Premium', 'Luxury'];
  const vehicleTypes = ['Sedan', 'SUV', 'Luxury Sedan', 'Luxury SUV', 'Van', 'Coach'];
  const addonOptions = [
    { id: 'Airport Pickup', label: '✈️ Airport Pickup' },
    { id: 'Hotel', label: '🏨 Hotel Booking' },
    { id: 'Guide', label: '👤 Tour Guide' },
    { id: 'Meals', label: '🍽️ Meals Included' }
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      
      {/* 1. Customer Information Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 transition-colors">
        <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4" />
          Customer Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Customer Name *</label>
            <input
              type="text"
              name="customer_name"
              required
              value={formData.customer_name || ''}
              onChange={onChange}
              placeholder="e.g. Rahul Kapoor"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Destination *</label>
            <div className="relative">
              <input
                type="text"
                name="destination"
                required
                value={formData.destination || ''}
                onChange={onChange}
                placeholder="e.g. Srisailam / Goa"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Travel Date</label>
            <input
              type="date"
              name="travel_date"
              value={formData.travel_date || ''}
              onChange={onChange}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Trip Duration</label>
            <input
              type="text"
              name="trip_duration"
              value={formData.trip_duration || ''}
              onChange={onChange}
              placeholder="e.g. 3 Days / 1 Week"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Budget Category</label>
            <select
              name="budget"
              value={formData.budget || 'Medium'}
              onChange={onChange}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              {budgets.map(b => (
                <option key={b} value={b}>{b} Budget</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Preferred Vehicle Class</label>
            <select
              name="vehicle_type"
              value={formData.vehicle_type || 'Sedan'}
              onChange={onChange}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              {vehicleTypes.map(vt => (
                <option key={vt} value={vt}>{vt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Number of Passengers</label>
            <input
              type="number"
              name="num_passengers"
              min="1"
              max="50"
              value={formData.num_passengers || '1'}
              onChange={onChange}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Preferences & Add-ons Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 transition-colors">
        <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Preferences & Add-ons
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Purpose of Trip</label>
            <select
              name="purpose"
              value={formData.purpose || 'Tourism'}
              onChange={onChange}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            >
              {purposes.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Desired Luxury Level</label>
            <select
              name="luxury_level"
              value={formData.luxury_level || 'Premium'}
              onChange={onChange}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            >
              {luxuryLevels.map(ll => (
                <option key={ll} value={ll}>{ll}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Target Add-ons</label>
          <div className="grid grid-cols-2 gap-2">
            {addonOptions.map(option => {
              const isChecked = (formData.addons || []).includes(option.id);
              return (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer select-none transition-all duration-200 ${
                    isChecked
                      ? 'bg-cyan-50/50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900/60 text-cyan-700 dark:text-indigo-455'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="addons"
                    value={option.id}
                    checked={isChecked}
                    onChange={onChange}
                    className="hidden"
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Special Requests / Notes</label>
          <textarea
            name="special_requests"
            value={formData.special_requests || ''}
            onChange={onChange}
            placeholder="e.g. Vegetarian meals, traveling with senior citizens, need airport meet & greet..."
            rows={2}
            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>
      </div>

      {/* 3. Current Booking Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 transition-colors">
        <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Current Booking Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Current Package *</label>
            <input
              type="text"
              name="current_package"
              required
              value={formData.current_package || ''}
              onChange={onChange}
              placeholder="e.g. Weekend Self-drive rental"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Vehicle Selected *</label>
            <input
              type="text"
              name="current_vehicle"
              required
              value={formData.current_vehicle || ''}
              onChange={onChange}
              placeholder="e.g. Maruti Suzuki Swift (Sedan)"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Price Paid / Quoted (INR) *</label>
            <input
              type="text"
              name="current_price"
              required
              value={formData.current_price || ''}
              onChange={onChange}
              placeholder="e.g. 5000"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Additional Booked Services</label>
            <input
              type="text"
              name="current_addons"
              value={formData.current_addons || ''}
              onChange={onChange}
              placeholder="e.g. None / Driver service"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 text-white font-bold rounded-xl text-sm shadow-xl shadow-cyan-200/30 dark:shadow-none hover:shadow-lg focus:outline-none transition-all duration-200 active:scale-99 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating AI Script...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 fill-white/20 text-white animate-pulse" />
            <span>✨ Generate AI Upsell Script</span>
          </>
        )}
      </button>

    </form>
  );
};
