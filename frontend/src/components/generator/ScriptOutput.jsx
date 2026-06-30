import React from 'react';
import { 
  CheckCircle2, 
  Copy, 
  FileText, 
  Share2, 
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  ThumbsUp,
  Download,
  IndianRupee,
  MessageCircle
} from 'lucide-react';
import { downloadScriptTxt } from '../../utils/scriptExport';

export const ScriptOutput = ({ 
  result, 
  onRegenerate, 
  onCopy, 
  onDownloadPdf, 
  onShare,
  children 
}) => {
  if (!result) return null;

  const safeParse = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch { return []; }
    }
    return [];
  };

  const isStructured = !!result.suggested_script;
  const recommendedUpgrade = result.recommended_upgrade || 'Package Upgrade';
  const upgradePrice = result.upgrade_price || '';
  const whyUpgrade = safeParse(result.why_upgrade);
  const suggestedScript = result.suggested_script || result.ai_response;
  const pricingComparison = result.pricing_comparison || '';
  const expectedBenefits = safeParse(result.expected_benefits);
  const objectionHandling = safeParse(result.objection_handling);
  const confidence = result.confidence_score || 'High';
  const tokenCost = result.token_cost || 0;

  const handleDownloadTxt = () => {
    downloadScriptTxt(result);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Recommended Upgrade Header Card */}
      <div className="bg-gradient-to-r from-cyan-600 to-violet-600 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 -translate-y-4 translate-x-4 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48" />
        </div>
        <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          ✨ Recommended Upgrade Proposal
        </span>
        <h2 className="text-xl md:text-2xl font-extrabold mt-3 tracking-tight flex items-center gap-2">
          {recommendedUpgrade}
          <ArrowUpRight className="w-5 h-5 shrink-0 text-cyan-200" />
        </h2>
      </div>

      {/* 2. Structured Details Grid */}
      {isStructured && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Why Upgrade Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 transition-colors">
            <h3 className="text-xs font-bold text-slate-555 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-500" />
              Why Customer Should Upgrade
            </h3>
            <ul className="space-y-2">
              {whyUpgrade.map((point, idx) => (
                <li key={idx} className="text-xs text-slate-600 dark:text-slate-350 flex items-start gap-2 leading-relaxed">
                  <span className="text-cyan-500 font-bold shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expected Benefits Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 transition-colors">
            <h3 className="text-xs font-bold text-slate-555 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-emerald-500" />
              Expected Benefits
            </h3>
            <ul className="space-y-2">
              {expectedBenefits.map((benefit, idx) => (
                <li key={idx} className="text-xs text-slate-650 dark:text-slate-350 flex items-start gap-2 font-medium leading-relaxed">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 3. Pricing Comparison Card */}
      {isStructured && pricingComparison && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 transition-colors">
          <h3 className="text-xs font-bold text-slate-555 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-500" />
            Pricing Comparison
          </h3>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-4">
            <p className="text-sm text-slate-700 dark:text-slate-200 font-medium whitespace-pre-wrap leading-relaxed">
              {pricingComparison}
            </p>
          </div>
        </div>
      )}

      {/* 4. Objection Handling Card */}
      {isStructured && objectionHandling.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 transition-colors">
          <h3 className="text-xs font-bold text-slate-555 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-amber-500" />
            Objection Handling
          </h3>
          <div className="space-y-3">
            {objectionHandling.map((item, idx) => (
              <div key={idx} className="border border-slate-200 dark:border-slate-755 rounded-xl overflow-hidden">
                <div className="bg-rose-50 dark:bg-rose-950/30 px-4 py-2.5 border-b border-slate-200 dark:border-slate-755">
                  <p className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <span className="text-base">🗣️</span>
                    Customer: {item.objection || ''}
                  </p>
                </div>
                <div className="bg-cyan-50 dark:bg-cyan-950/20 px-4 py-2.5">
                  <p className="text-xs font-semibold text-cyan-700 dark:text-indigo-300 flex items-start gap-2 leading-relaxed">
                    <span className="text-base shrink-0">💬</span>
                    <span>{item.rebuttal || ''}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Suggested Script Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-805 bg-slate-50/50 dark:bg-slate-800/40 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
            Suggested Sales Script
          </h3>
          
          {/* Action Toolbar */}
          <div className="flex items-center gap-1">
            <button
              onClick={onCopy}
              title="Copy script"
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={onDownloadPdf}
              title="Download PDF"
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadTxt}
              title="Download TXT"
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onShare}
              title="Share script"
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onRegenerate}
              title="Regenerate"
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 min-h-[180px] text-sm md:text-base font-medium font-sans">
            {suggestedScript}
          </div>

          {/* AI Metrics Footer */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold pt-2">
            <span>Model: Gemini 2.5 Flash</span>
            <div className="flex items-center gap-3">
              <span>Confidence: <span className={`font-bold ${confidence === 'High' ? 'text-emerald-500' : 'text-amber-500'}`}>{confidence}</span></span>
              <span>Est. Tokens: {tokenCost}</span>
            </div>
          </div>

          {children}
        </div>
      </div>

    </div>
  );
};
