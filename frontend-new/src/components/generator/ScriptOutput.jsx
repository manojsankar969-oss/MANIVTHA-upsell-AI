import React from 'react';
import { 
  CheckCircle2, 
  Copy, 
  FileText, 
  Share2, 
  RotateCcw 
} from 'lucide-react';
import { Button } from '../ui/Button';

export const ScriptOutput = ({ 
  result, 
  onRegenerate, 
  onCopy, 
  onDownloadPdf, 
  onShare,
  children 
}) => {
  if (!result) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
      {/* Action Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-3">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          AI Generated Upsell Script
        </h3>
        
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            onClick={onCopy}
            title="Copy to clipboard"
            className="hover:bg-slate-100 text-slate-500 p-2"
          >
            <Copy className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            onClick={onDownloadPdf}
            title="Download PDF"
            className="hover:bg-slate-100 text-slate-500 p-2"
          >
            <FileText className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            onClick={onShare}
            title="Share script"
            className="hover:bg-slate-100 text-slate-500 p-2"
          >
            <Share2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            onClick={onRegenerate}
            title="Regenerate script"
            className="hover:bg-slate-100 text-slate-500 p-2"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Script Body */}
      <div className="p-6">
        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100 min-h-[280px] text-sm md:text-base font-medium">
          {result.ai_response}
        </div>

        {/* Feedback block mounting point */}
        {children}
      </div>
    </div>
  );
};
