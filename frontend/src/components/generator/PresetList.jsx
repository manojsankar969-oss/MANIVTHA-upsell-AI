import React from 'react';
import { 
  Plane, 
  Map, 
  Heart, 
  Briefcase, 
  Compass, 
  Crown,
  Sparkles
} from 'lucide-react';

const getPresetConfig = (name) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('airport') || nameLower.includes('transfer')) {
    return { icon: Plane, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/25' };
  }
  if (nameLower.includes('weekend') || nameLower.includes('hill')) {
    return { icon: Map, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/25' };
  }
  if (nameLower.includes('wedding')) {
    return { icon: Heart, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/25' };
  }
  if (nameLower.includes('corporate') || nameLower.includes('business')) {
    return { icon: Briefcase, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20 border-indigo-100 dark:border-cyan-900/25' };
  }
  if (nameLower.includes('outstation') || nameLower.includes('temple')) {
    return { icon: Compass, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/25' };
  }
  if (nameLower.includes('luxury') || nameLower.includes('tourist')) {
    return { icon: Crown, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/25' };
  }
  return { icon: Sparkles, color: 'text-slate-500 bg-slate-50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-900/25' };
};

export const PresetList = ({ presets, onApply }) => {
  if (!presets || presets.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-500 font-medium">
        No templates found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {presets.map((preset) => {
        const { icon: Icon, color } = getPresetConfig(preset.name);
        // Extract destination or vehicle class for a quick subtitle
        const subtitle = preset.data?.destination 
          ? `To ${preset.data.destination} • ${preset.data.vehicleType || 'Car'}` 
          : (preset.data?.current_vehicle || 'Standard Trip');

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApply(preset)}
            className="text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-sm transition-all duration-200 group flex items-start gap-3 select-none"
          >
            <div className={`rounded-lg p-2 shrink-0 border ${color} group-hover:scale-105 transition-transform`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {preset.name}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate mt-1">
                {subtitle}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
