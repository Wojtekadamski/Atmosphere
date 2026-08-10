import React, { useState } from 'react';
import { DailyPoint, HourlyPoint, TempUnit, Language } from '../types';
import { formatTemp } from '../utils/formatters';
import { TRANSLATIONS, getWmoWeatherDescription } from '../constants/translations';
import {
  Calendar,
  ChevronDown,
  CloudRain,
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  Snowflake,
  CloudLightning,
} from 'lucide-react';

interface DailyForecastCardProps {
  daily: DailyPoint[];
  hourly?: HourlyPoint[];
  tempUnit: TempUnit;
  lang?: Language;
}

function getWeatherIcon(code: number) {
  if (code === 0) return <Sun className="w-5 h-5 text-amber-500" />;
  if (code === 1 || code === 2) return <CloudSun className="w-5 h-5 text-amber-400" />;
  if (code === 3) return <Cloud className="w-5 h-5 text-slate-400" />;
  if (code === 45 || code === 48) return <CloudFog className="w-5 h-5 text-slate-400" />;
  if (code >= 51 && code <= 57) return <CloudDrizzle className="w-5 h-5 text-cyan-400" />;
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain className="w-5 h-5 text-cyan-500" />;
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <Snowflake className="w-5 h-5 text-blue-300" />;
  if (code >= 95) return <CloudLightning className="w-5 h-5 text-amber-400" />;
  return <Sun className="w-5 h-5 text-amber-500" />;
}

export const DailyForecastCard: React.FC<DailyForecastCardProps> = ({
  daily,
  hourly = [],
  tempUnit,
  lang = 'en' as Language,
}) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const activeLang: Language = lang === 'pl' ? 'pl' : 'en';
  const t = TRANSLATIONS[activeLang];

  // Calculate global min and max for temperature bar scaling across the 7 days
  const allLows = daily.map((d) => d.lowTemp);
  const allHighs = daily.map((d) => d.highTemp);
  const minOverall = Math.min(...(allLows.length > 0 ? allLows : [0]));
  const maxOverall = Math.max(...(allHighs.length > 0 ? allHighs : [30]));
  const range = maxOverall - minOverall || 1;

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800/80 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span>{t.dailyOutlookTitle}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.dailyOutlookSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
        {daily.map((day, idx) => {
          const weatherDesc = getWmoWeatherDescription(day.weatherCode, activeLang);
          const hourlyForDay = hourly.filter((h) => h.time.startsWith(day.date));
          const isExpanded = expandedDate === day.date;
          
          let dayDisplay = day.dayOfWeek;
          if (idx === 0) {
            dayDisplay = t.today;
          } else if (activeLang === 'pl') {
            const dayMap: Record<string, string> = {
              'Sunday': 'Niedziela',
              'Monday': 'Poniedziałek',
              'Tuesday': 'Wtorek',
              'Wednesday': 'Środa',
              'Thursday': 'Czwartek',
              'Friday': 'Piątek',
              'Saturday': 'Sobota',
            };
            dayDisplay = dayMap[day.dayOfWeek] || day.dayOfWeek;
          }

          // Calculate temperature bar offsets
          const leftPct = Math.max(0, Math.min(100, ((day.lowTemp - minOverall) / range) * 100));
          const widthPct = Math.max(8, Math.min(100 - leftPct, ((day.highTemp - day.lowTemp) / range) * 100));

          return (
            <div key={day.date} className="space-y-3">
              <button
                type="button"
                onClick={() => setExpandedDate((prev) => (prev === day.date ? null : day.date))}
                className={`w-full py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left rounded-2xl border transition-colors ${
                  isExpanded
                    ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                    : 'border-transparent hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                } px-3`}
              >
              {/* Day Name & Weather Description */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center font-bold shrink-0 border border-slate-200/50 dark:border-slate-700/50">
                  {getWeatherIcon(day.weatherCode)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {dayDisplay}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {weatherDesc}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto text-slate-500 dark:text-slate-400">
                <span className="text-xs uppercase tracking-wide font-semibold">
                  {isExpanded ? t.collapseDetails : t.expandDetails}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                />
              </div>

              {/* Rain Chance Bar */}
              <div className="flex items-center gap-2 w-full sm:w-40">
                <CloudRain className={`w-4 h-4 shrink-0 ${day.rainProb > 20 ? 'text-cyan-500' : 'text-slate-300 dark:text-slate-600'}`} />
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${day.rainProb}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 min-w-[36px] text-right">
                  {day.rainProb}%
                </span>
              </div>

              {/* High / Low Temp Display & Range Bar */}
              <div className="flex items-center gap-3 justify-end min-w-[220px]">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 min-w-[42px] text-right">
                  {formatTemp(day.lowTemp, tempUnit)}
                </span>

                {/* Temperature Visual Range Bar */}
                <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden shrink-0">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-teal-400 to-amber-500"
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                    }}
                  />
                </div>

                <span className="text-base font-extrabold text-slate-900 dark:text-white min-w-[42px]">
                  {formatTemp(day.highTemp, tempUnit)}
                </span>
              </div>
              </button>
              {isExpanded && (
                <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
                    {t.hourlyDetails}
                  </div>
                  {hourlyForDay.length > 0 ? (
                    <div className="grid grid-cols-[72px_1fr_84px_72px] gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold mb-3">
                      <span>{t.hourLabel}</span>
                      <span>{t.weatherLabel}</span>
                      <span>{t.temperatureLabel}</span>
                      <span>{t.rainProbLabel}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 dark:text-slate-400">No hourly readings available</div>
                  )}
                  <div className="space-y-2">
                    {hourlyForDay.map((hour) => (
                      <div
                        key={hour.time}
                        className="grid grid-cols-[72px_1fr_84px_72px] gap-2 items-center text-[13px] text-slate-700 dark:text-slate-200"
                      >
                        <span className="font-medium">{hour.displayTime}</span>
                        <span>{hour.weatherDescription}</span>
                        <span className="font-semibold">{formatTemp(hour.averageTemp, tempUnit)}</span>
                        <span className="font-semibold text-cyan-500">{hour.averageRainProb}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
