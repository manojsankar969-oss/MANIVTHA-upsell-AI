import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';

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
      <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center animate-fade-in">
        <p className="text-emerald-800 text-sm font-semibold flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
          Thank you! Your feedback helps train our upsell AI models.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-8 border-t border-slate-100">
      <h4 className="text-sm font-semibold text-slate-500 mb-4 text-center tracking-tight uppercase">
        How would you rate this script?
      </h4>
      
      {/* Star Selector */}
      <div className="flex justify-center gap-2 mb-5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = rating >= star;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              className={`p-2.5 rounded-xl transition-all duration-150 ${
                isActive 
                  ? 'text-amber-400 bg-amber-50 shadow-sm scale-110' 
                  : 'text-slate-300 hover:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-8 h-8 ${isActive ? 'fill-current' : ''}`} />
            </button>
          );
        })}
      </div>

      {/* Conditional comment field */}
      {rating > 0 && (
        <div className="space-y-3.5 animate-fade-in">
          <Textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Add comments or edit instructions to improve the AI response (optional)..."
            rows={2}
            className="text-sm"
          />
          
          <Button
            onClick={onSubmit}
            variant="dark"
            loading={loading}
            className="w-full py-2.5 text-sm"
          >
            Submit Script Feedback
          </Button>
        </div>
      )}
    </div>
  );
};
