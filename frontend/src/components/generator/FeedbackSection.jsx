import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export const FeedbackSection = ({
  rating,
  comment,
  submitted,
  loading,
  onRatingChange,
  onCommentChange,
  onSubmit
}) => {
  if (submitted) {
    return (
      <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl text-center animate-fade-in transition-colors">
        <p className="text-emerald-800 dark:text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
          Thank you! Your feedback helps train our upsell AI models.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
      <h4 className="text-xs font-bold text-slate-400 dark:text-slate-550 mb-3 text-center tracking-wider uppercase">
        Rate this script
      </h4>
      
      {/* Star Selector */}
      <div className="flex justify-center gap-1.5 mb-4">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = rating >= star;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              className={`p-2 rounded-lg transition-all duration-150 ${
                isActive 
                  ? 'text-amber-400 scale-110' 
                  : 'text-slate-300 dark:text-slate-700 hover:text-slate-400 hover:scale-105'
              }`}
            >
              <Star className={`w-7 h-7 transition-all ${isActive ? 'fill-current' : ''}`} />
            </button>
          );
        })}
      </div>

      {/* Conditional comment field */}
      {rating > 0 && (
        <div className="space-y-3.5 animate-fade-in">
          <textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="What could be improved? (e.g. tone, vehicle suggestion, length)..."
            rows={2}
            className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none transition-colors"
          />
          
          <button
            onClick={onSubmit}
            disabled={loading}
            className="w-full py-2 bg-slate-900 dark:bg-slate-850 hover:bg-slate-800 dark:hover:bg-slate-750 text-white font-bold rounded-xl text-xs transition-all active:scale-99 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      )}
    </div>
  );
};
