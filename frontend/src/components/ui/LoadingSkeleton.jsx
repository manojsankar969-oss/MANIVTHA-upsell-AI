import React from 'react';

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 1. Header Card Skeleton */}
      <div className="bg-slate-200 dark:bg-slate-800 h-28 rounded-2xl p-6 flex flex-col justify-end gap-3">
        <div className="bg-slate-300 dark:bg-slate-700 h-4 w-36 rounded-full"></div>
        <div className="bg-slate-300 dark:bg-slate-700 h-7 w-3/4 rounded-full"></div>
      </div>

      {/* 2. Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="bg-slate-200 dark:bg-slate-800 h-4 w-28 rounded-full"></div>
          <div className="space-y-2">
            <div className="bg-slate-100 dark:bg-slate-800 h-3 w-full rounded-full"></div>
            <div className="bg-slate-100 dark:bg-slate-800 h-3 w-5/6 rounded-full"></div>
            <div className="bg-slate-100 dark:bg-slate-800 h-3 w-4/5 rounded-full"></div>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="bg-slate-200 dark:bg-slate-800 h-4 w-28 rounded-full"></div>
          <div className="space-y-2">
            <div className="bg-slate-100 dark:bg-slate-800 h-3 w-full rounded-full"></div>
            <div className="bg-slate-100 dark:bg-slate-800 h-3 w-5/6 rounded-full"></div>
            <div className="bg-slate-100 dark:bg-slate-800 h-3 w-4/5 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 3. Script Body Skeleton */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-between items-center">
          <div className="bg-slate-200 dark:bg-slate-800 h-4 w-32 rounded-full"></div>
          <div className="flex gap-2">
            <div className="bg-slate-200 dark:bg-slate-800 h-8 w-8 rounded-lg"></div>
            <div className="bg-slate-200 dark:bg-slate-800 h-8 w-8 rounded-lg"></div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3 min-h-[180px]">
            <div className="bg-slate-200 dark:bg-slate-800 h-4 w-11/12 rounded-full"></div>
            <div className="bg-slate-200 dark:bg-slate-800 h-4 w-full rounded-full"></div>
            <div className="bg-slate-200 dark:bg-slate-800 h-4 w-4/5 rounded-full"></div>
            <div className="bg-slate-200 dark:bg-slate-800 h-4 w-5/6 rounded-full"></div>
            <div className="bg-slate-200 dark:bg-slate-800 h-4 w-2/3 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
