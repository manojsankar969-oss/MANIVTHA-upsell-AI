import React from 'react';
import { Zap } from 'lucide-react';

export const PresetList = ({ presets, onApply }) => {
  return (
    <div className="space-y-3">
      {presets.map((preset, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onApply(preset)}
          className="w-full text-left p-3.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all duration-200 group flex items-start gap-3 bg-white"
        >
          <div className="bg-amber-50 rounded-lg p-1.5 text-amber-500 group-hover:bg-amber-100 transition-colors mt-0.5">
            <Zap className="w-4 h-4 fill-amber-400/20" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
              {preset.name}
            </p>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {preset.booking_inputs}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};
