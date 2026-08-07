import React from 'react';
import {
  CloudRain,
  Wind,
  Droplets,
  Layers,
  Thermometer,
  ShieldCheck,
  RefreshCw,
  Star,
  Navigation,
} from 'lucide-react';
import { WeatherAggregatedData, TempUnit, WindUnit, Location, Language } from '../types';
import { formatTemp, formatWind, getCountryFlag, getWindCardinal } from '../utils/formatters';
import { WEATHER_PROVIDERS } from '../constants/providers';
import { TRANSLATIONS, getWmoWeatherDescription } from '../constants/translations';

interface WeatherHeaderCardProps {
  data: WeatherAggregatedData;
  tempUnit: TempUnit;
  windUnit: WindUnit;
  isFavorite: boolean;
  onToggleFavorite: (loc: Location) => void;
  onRefresh: () => void;
  loading: boolean;
  lang?: Language;
}

export const WeatherHeaderCard: React.FC<WeatherHeaderCardProps> = ({
  data,
  tempUnit,
  windUnit,
  isFavorite,
  onToggleFavorite,
  onRefresh,
  loading,
  lang = 'en',
}) => {
  const activeLang: Language = lang === 'pl' ? 'pl' : 'en';
  const t = TRANSLATIONS[activeLang];
  const { location, current } = data;
  const weatherDescription = getWmoWeatherDescription(current.weatherCode, activeLang);

  const consensusText =
    current.spreadDeg <= 0.8
      ? t.consensusHigh
      : current.spreadDeg <= 1.8
      ? t.consensusModerate
      : t.consensusDivergent;

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Location, Current Temperature & Consensus Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between lg:justify-start gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{getCountryFlag(location.countryCode)}</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  {location.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  {location.region ? `${location.region}, ` : ''}
                  {location.country} • {location.timezone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(location)}
                className={`p-2 rounded-xl transition-all cursor-pointer border ${
                  isFavorite
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title={isFavorite ? t.removeFromFavorites : t.saveToFavorites}
              >
                <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={onRefresh}
                disabled={loading}
                className="p-2 bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 rounded-xl transition-all border border-slate-700 cursor-pointer disabled:opacity-50"
                title={t.refreshData}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Temperature & Weather Description */}
          <div className="flex items-baseline gap-4 pt-2">
            <div className="text-5xl sm:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-200">
              {formatTemp(current.temp, tempUnit)}
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-slate-200">{weatherDescription}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  {t.feelsLike} {formatTemp(current.feelsLike, tempUnit)}
                </span>
              </div>
            </div>
          </div>

          {/* Multi-Service Consensus Status Badge */}
          <div className="inline-flex flex-wrap items-center gap-2 bg-slate-800/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.modelsAggregated}</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="text-xs font-medium text-slate-300">
              {t.modelSpread}: <span className="font-bold text-blue-300">{current.spreadDeg}°C</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="text-xs font-medium text-slate-300">
              {t.agreementScore}: <span className="font-bold text-emerald-300">{current.modelAgreementScore}%</span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Current Metrics Grid & Individual Model Mini Badges */}
        <div className="flex flex-col gap-4 min-w-[280px]">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                <span>{t.rainChance}</span>
              </div>
              <div className="text-xl font-extrabold text-white">{current.rainProb}%</div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
                <Wind className="w-4 h-4 text-teal-400" />
                <span>{t.windAndDirection}</span>
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-white flex flex-wrap items-center gap-2">
                <span>{formatWind(current.windSpeed, windUnit)}</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-300 bg-teal-950/60 border border-teal-800/80 px-2 py-0.5 rounded-lg">
                  <Navigation
                    className="w-3 h-3 text-teal-400 transition-transform duration-500"
                    style={{ transform: `rotate(${current.windDirection || 0}deg)` }}
                  />
                  <span>{getWindCardinal(current.windDirection || 0, activeLang)} ({Math.round(current.windDirection || 0)}°)</span>
                </span>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span>{t.humidity}</span>
              </div>
              <div className="text-xl font-extrabold text-white">{current.humidity}%</div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-700/60">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>{t.consensusLabel}</span>
              </div>
              <div className="text-xl font-extrabold text-white">
                {consensusText}
              </div>
            </div>
          </div>

          {/* Current Temperature by Individual Provider */}
          <div className="bg-slate-800/30 p-3 rounded-2xl border border-slate-700/40">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              {t.individualModelReadings}
            </div>
            <div className="grid grid-cols-5 gap-1.5 text-center">
              {Object.entries(current.providerTemps).map(([providerId, temp]) => {
                const provider = WEATHER_PROVIDERS[providerId as keyof typeof WEATHER_PROVIDERS];
                return (
                  <div key={providerId} className="p-1.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-[10px] font-bold truncate" style={{ color: provider?.color }}>
                      {provider?.shortName}
                    </div>
                    <div className="text-xs font-extrabold text-slate-100">
                      {formatTemp(temp as number, tempUnit)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
