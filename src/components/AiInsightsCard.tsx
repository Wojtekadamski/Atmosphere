import React from 'react';
import { Sparkles, Shirt, Lightbulb } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface AiInsightsProps {
  locationName: string;
  aiSummary?: {
    summary: string;
    consensusRating: string;
    keyInsights: string[];
    clothingAdvice: string;
  };
  loading?: boolean;
  lang?: Language;
}

export const AiInsightsCard: React.FC<AiInsightsProps> = ({
  locationName,
  aiSummary,
  loading,
  lang = 'en',
}) => {
  if (!aiSummary) return null;
  const t = TRANSLATIONS[lang];

  const ratingColor =
    aiSummary.consensusRating.toLowerCase().includes('high') || aiSummary.consensusRating.toLowerCase().includes('wysok')
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      : aiSummary.consensusRating.toLowerCase().includes('mod') || aiSummary.consensusRating.toLowerCase().includes('umiark')
      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';

  return (
    <div className="w-full bg-gradient-to-br from-blue-50/60 via-indigo-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 rounded-3xl p-6 sm:p-8 border border-blue-200/60 dark:border-indigo-900/50 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {t.aiCardTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.aiCardSubtitle.replace('{location}', locationName)}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${ratingColor}`}>
          {aiSummary.consensusRating} {t.agreementSuffix}
        </span>
      </div>

      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
        {aiSummary.summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="md:col-span-2 bg-white/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-blue-100 dark:border-slate-700/80 space-y-2">
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>{t.keyTakeaways}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {aiSummary.keyInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-blue-100 dark:border-slate-700/80 space-y-2 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Shirt className="w-4 h-4 text-purple-500" />
            <span>{t.whatToWear}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {aiSummary.clothingAdvice}
          </p>
        </div>
      </div>
    </div>
  );
};
