import React from 'react';
import { CurrentConditions, TempUnit, Language } from '../types';
import { WEATHER_PROVIDERS } from '../constants/providers';
import { formatTemp } from '../utils/formatters';
import { TRANSLATIONS } from '../constants/translations';
import { Layers, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';

interface ProviderComparisonCardsProps {
  current: CurrentConditions;
  tempUnit: TempUnit;
  lang?: Language;
}

export const ProviderComparisonCards: React.FC<ProviderComparisonCardsProps> = ({
  current,
  tempUnit,
  lang = 'en',
}) => {
  const t = TRANSLATIONS[lang];
  const avgTemp = current.temp;

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800/80 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            <span>{t.serviceComparisonTitle}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.serviceComparisonSubtitle}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
          <span>{t.consensusAvg}:</span>
          <span className="font-extrabold text-blue-600 dark:text-blue-400">
            {formatTemp(avgTemp, tempUnit)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(WEATHER_PROVIDERS).map(([pid, pInfo]) => {
          const providerTemp = current.providerTemps[pid as keyof typeof current.providerTemps] ?? avgTemp;
          const diff = Math.round((providerTemp - avgTemp) * 10) / 10;
          const isHigher = diff > 0;
          const isLower = diff < 0;
          const isExact = diff === 0;

          return (
            <div
              key={pid}
              className="group relative bg-slate-50/80 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between space-y-3"
            >
              {/* Top Bar: Provider Name & Color Dot */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: pInfo.color }}
                    />
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {pInfo.shortName}
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {pInfo.organization}
                  </p>
                </div>
              </div>

              {/* Middle: Provider Temp & Variance Badge */}
              <div className="space-y-1 my-2">
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {formatTemp(providerTemp, tempUnit)}
                </div>

                <div className="flex items-center gap-1.5">
                  {isExact ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                      <CheckCircle2 className="w-3 h-3" /> {t.exactConsensus}
                    </span>
                  ) : isHigher ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/60">
                      <ArrowUpRight className="w-3 h-3" /> +{diff}°C {t.warmer}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/60">
                      <ArrowDownRight className="w-3 h-3" /> {diff}°C {t.cooler}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom: Provider description */}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 pt-2">
                {pInfo.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
