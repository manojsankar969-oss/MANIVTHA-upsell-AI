import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  FileText, 
  Download, 
  Star, 
  SlidersHorizontal, 
  X,
  Calendar,
  User,
  MapPin
} from 'lucide-react';
import { downloadScriptTxt } from '../../utils/scriptExport';

export function HistoryTable({
  history,
  loading,
  page,
  total,
  totalPages,
  onViewRecord,
  onPageChange,
  onDownloadPdf
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState('');
  const [rating, setRating] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const vehicleTypes = ['Sedan', 'SUV', 'Luxury Sedan', 'Luxury SUV', 'Van', 'Coach'];

  // Trigger fetch when search or filters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onPageChange(1, searchTerm, { dateRange, rating, vehicleType });
    }, 400); // Debounce search

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dateRange, rating, vehicleType, onPageChange]);

  const handlePageClick = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage, searchTerm, { dateRange, rating, vehicleType });
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDateRange('');
    setRating('');
    setVehicleType('');
  };

  const hasActiveFilters = searchTerm || dateRange || rating || vehicleType;

  const handleDownloadTxt = (record) => {
    downloadScriptTxt(record);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer, destination or staff..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-455 dark:hover:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-150 dark:border-rose-900/40 rounded-xl transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters Drawer */}
      {showFilters && (
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in transition-colors">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-755 rounded-lg text-xs text-slate-700 dark:text-white focus:outline-none"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-755 rounded-lg text-xs text-slate-700 dark:text-white focus:outline-none"
            >
              <option value="">All Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
              <option value="4">⭐⭐⭐⭐ 4 Stars</option>
              <option value="3">⭐⭐⭐ 3 Stars</option>
              <option value="2">⭐⭐ 2 Stars</option>
              <option value="1">⭐ 1 Star</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1.5">Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-755 rounded-lg text-xs text-slate-700 dark:text-white focus:outline-none"
            >
              <option value="">All Vehicle Classes</option>
              {vehicleTypes.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Table Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Destination</th>
                <th className="px-6 py-3.5">Vehicle Type</th>
                <th className="px-6 py-3.5">Feedback</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-semibold text-slate-400">Loading history...</span>
                    </div>
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium">
                    No matching generations found.
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr 
                    key={record.id} 
                    className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-450 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(record.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-600 dark:text-slate-400 font-semibold group-hover:bg-cyan-50 dark:group-hover:bg-cyan-950 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {(record.customer_name || 'C')[0].toUpperCase()}
                        </div>
                        <div>
                          <p>{record.customer_name || 'N/A'}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">By {record.staff_name || 'Staff'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{record.destination || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg">
                        {record.vehicle_type || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.rating ? (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              className={`w-3.5 h-3.5 ${star <= record.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-850'}`}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-wider">No Feedback</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewRecord(record)}
                          title="View script in Generator"
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadTxt(record)}
                          title="Download TXT"
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-455 rounded-lg transition-all"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDownloadPdf(record)}
                          title="Download PDF Report"
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/60 flex items-center justify-between transition-colors">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Showing page <span className="font-bold text-slate-800 dark:text-white">{page}</span> of <span className="font-bold text-slate-800 dark:text-white">{totalPages}</span> ({total} items)
            </span>

            <div className="flex gap-1.5">
              <button
                onClick={() => handlePageClick(page - 1)}
                disabled={page === 1}
                className="p-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageClick(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
