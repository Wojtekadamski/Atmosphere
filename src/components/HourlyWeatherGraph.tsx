import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  HourlyPoint,
  ProviderId,
  TempUnit,
  WindUnit,
  GraphViewMode,
  TimeRange,
  Language,
} from '../types';
import { WEATHER_PROVIDERS } from '../constants/providers';
import { formatTempNumber, formatWind, formatWindNumber, getWindCardinal } from '../utils/formatters';
import { TRANSLATIONS, getWmoWeatherDescription } from '../constants/translations';
import {
  TrendingUp,
  SlidersHorizontal,
  Info,
  Navigation,
} from 'lucide-react';

interface HourlyWeatherGraphProps {
  hourlyData: HourlyPoint[];
  tempUnit: TempUnit;
  windUnit: WindUnit;
  lang?: Language;
}

export const HourlyWeatherGraph: React.FC<HourlyWeatherGraphProps> = ({
  hourlyData,
  tempUnit,
  windUnit,
  lang = 'en',
}) => {
  const activeLang: Language = lang === 'pl' ? 'pl' : 'en';
  const t = TRANSLATIONS[activeLang];
  const [viewMode, setViewMode] = useState<GraphViewMode>('combined');
  const [timeRange, setTimeRange] = useState<TimeRange>(24);
  const [activeProviders, setActiveProviders] = useState<Record<ProviderId, boolean>>({
    ecmwf: true,
    gfs: true,
    icon: true,
    metno: true,
    meteofrance: true,
  });

  // Filter dataset by time range
  const filteredHourly = hourlyData.slice(0, timeRange);

  // Transform dataset for Recharts with converted units
  const chartData = filteredHourly.map((item) => {
    const weatherDescription = getWmoWeatherDescription(item.weatherCode, activeLang);

    const formattedItem: any = {
      rawTime: item.time,
      displayTime: item.displayTime,
      formattedDate: item.formattedDate,
      dayName: item.dayName,
      weatherCode: item.weatherCode,
      weatherDescription,
      averageTemp: formatTempNumber(item.averageTemp, tempUnit),
      medianTemp: formatTempNumber(item.medianTemp, tempUnit),
      minTemp: formatTempNumber(item.minTemp, tempUnit),
      maxTemp: formatTempNumber(item.maxTemp, tempUnit),
      // Array range for area band [min, max]
      tempBand: [
        formatTempNumber(item.minTemp, tempUnit),
        formatTempNumber(item.maxTemp, tempUnit),
      ],
      averageRainProb: item.averageRainProb,
      maxRainProb: item.maxRainProb,
      rawWindSpeed: item.averageWindSpeed,
      windSpeed: formatWindNumber(item.averageWindSpeed, windUnit),
      windDirection: item.averageWindDirection || 0,
      windCardinal: getWindCardinal(item.averageWindDirection || 0, activeLang),
    };

    // Add individual provider values converted
    Object.keys(item.providers).forEach((pid) => {
      const pData = item.providers[pid as ProviderId];
      if (pData) {
        formattedItem[`temp_${pid}`] = formatTempNumber(pData.temp, tempUnit);
        formattedItem[`rain_${pid}`] = pData.rainProb;
        formattedItem[`wind_${pid}`] = formatWindNumber(pData.windSpeed, windUnit);
      }
    });

    return formattedItem;
  });

  const toggleProvider = (id: ProviderId) => {
    setActiveProviders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Custom Interactive Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const dataPoint = payload[0]?.payload;
    if (!dataPoint) return null;

    const hourData = hourlyData.find((h) => h.time === dataPoint.rawTime);

    return (
      <div className="bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md max-w-sm z-50 text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="font-bold text-slate-200 text-sm">{dataPoint.formattedDate}</div>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium">
            {dataPoint.weatherDescription}
          </span>
        </div>

        {/* Aggregated Highlights */}
        <div className="grid grid-cols-3 gap-2 text-center bg-slate-800/60 p-2 rounded-xl">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">{t.avgTempLabel}</div>
            <div className="text-sm font-extrabold text-blue-400">
              {dataPoint.averageTemp}°{tempUnit}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">{t.rainProbLabel}</div>
            <div className="text-sm font-extrabold text-cyan-400">
              {dataPoint.averageRainProb}%
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">{t.avgWindLabel}</div>
            <div className="text-sm font-extrabold text-teal-400 flex items-center justify-center gap-1">
              <span>{formatWind(dataPoint.rawWindSpeed, windUnit)}</span>
              <Navigation
                className="w-2.5 h-2.5 text-teal-300"
                style={{ transform: `rotate(${dataPoint.windDirection || 0}deg)` }}
              />
            </div>
          </div>
        </div>

        {/* Breakdown table across 5 providers */}
        {hourData && (
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{t.providerComparison}</span>
              <span>{t.tempRainHead} / {t.viewWind}</span>
            </div>
            <div className="space-y-1">
              {Object.entries(WEATHER_PROVIDERS).map(([pid, pInfo]) => {
                const pVal = hourData.providers[pid as ProviderId];
                if (!pVal) return null;
                const convertedTemp = formatTempNumber(pVal.temp, tempUnit);
                const pWindDir = pVal.windDirection ?? hourData.averageWindDirection ?? 0;

                return (
                  <div
                    key={pid}
                    className="flex items-center justify-between p-1.5 rounded-lg bg-slate-800/40 border border-slate-800"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: pInfo.color }}
                      />
                      <span className="font-semibold text-slate-300">{pInfo.shortName}</span>
                    </div>
                    <div className="font-mono text-slate-200 flex items-center gap-1.5 text-[11px]">
                      <span className="font-bold">{convertedTemp}°{tempUnit}</span>
                      <span className="text-cyan-400">{pVal.rainProb}%</span>
                      <span className="text-teal-400 flex items-center gap-0.5">
                        {formatWind(pVal.windSpeed, windUnit)}
                        <Navigation
                          className="w-2 h-2 text-teal-300 inline"
                          style={{ transform: `rotate(${pWindDir}deg)` }}
                        />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800/80 space-y-6">
      {/* Graph Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{t.graphTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.graphSubtitle.replace('{unit}', tempUnit)}
          </p>
        </div>

        {/* Graph View Selector & Time Range Selector */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Time Window Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none bg-slate-100 dark:bg-slate-800 p-1 rounded-xl min-w-0">
            {([24, 48, 168] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {range === 24 ? t.range24h : range === 48 ? t.range48h : t.range7d}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none bg-slate-100 dark:bg-slate-800 p-1 rounded-xl min-w-0">
            <button
              onClick={() => setViewMode('combined')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'combined'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.viewCombined}
            </button>
            <button
              onClick={() => setViewMode('aggregated')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'aggregated'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.viewConsensusBand}
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.viewAllProviders}
            </button>
            <button
              onClick={() => setViewMode('rain')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'rain'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.viewRainfallPct}
            </button>
            <button
              onClick={() => setViewMode('wind')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'wind'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.viewWind}
            </button>
          </div>
        </div>
      </div>

      {/* Provider Filter Checkboxes (Shown in 'all' view or combined) */}
      {viewMode === 'all' && (
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> {t.filterServices}:
          </div>
          {Object.entries(WEATHER_PROVIDERS).map(([pid, pInfo]) => {
            const isActive = activeProviders[pid as ProviderId];
            return (
              <button
                key={pid}
                onClick={() => toggleProvider(pid as ProviderId)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 shadow-xs text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: isActive ? pInfo.color : '#94a3b8' }}
                />
                <span>{pInfo.shortName}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Chart Canvas Container */}
      <div className="w-full pt-2 overflow-x-auto scrollbar-none">
        <div
          className="h-[360px] sm:h-[400px]"
          style={{ minWidth: Math.max(900, filteredHourly.length * 24) }}
        >
          <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'combined' ? (
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
              <XAxis
                dataKey="displayTime"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                interval={timeRange > 48 ? 11 : timeRange === 48 ? 3 : 1}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                unit={`°`}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#06b6d4' }}
                axisLine={false}
                tickLine={false}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>}
              />
              {/* Rain bars on right axis */}
              <Bar
                yAxisId="right"
                dataKey="averageRainProb"
                name={t.legendRainProb}
                fill="url(#rainGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              {/* Temperature line on left axis */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="averageTemp"
                name={`${t.legendConsensusTemp} (°${tempUnit})`}
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 6, fill: '#2563eb' }}
              />
            </ComposedChart>
          ) : viewMode === 'aggregated' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
              <XAxis
                dataKey="displayTime"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                interval={timeRange > 48 ? 11 : timeRange === 48 ? 3 : 1}
              />
              <YAxis
                width={35}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                unit={`°`}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Shaded Area showing Min-Max Model Spread Band */}
              <Area
                type="monotone"
                dataKey="tempBand"
                name={t.legendModelVariance}
                stroke="#60a5fa"
                fill="url(#bandGradient)"
              />
              {/* Central Average Line */}
              <Line
                type="monotone"
                dataKey="averageTemp"
                name={`${t.legendAggregatedAvg} (°${tempUnit})`}
                stroke="#1d4ed8"
                strokeWidth={3.5}
                dot={false}
              />
            </AreaChart>
          ) : viewMode === 'all' ? (
            <ComposedChart data={chartData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
              <XAxis
                dataKey="displayTime"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                interval={timeRange > 48 ? 11 : timeRange === 48 ? 3 : 1}
              />
              <YAxis
                width={35}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                unit={`°`}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-semibold">{value}</span>}
              />

              {/* Render lines for active providers */}
              {Object.entries(WEATHER_PROVIDERS).map(([pid, pInfo]) => {
                if (!activeProviders[pid as ProviderId]) return null;
                return (
                  <Line
                    key={pid}
                    type="monotone"
                    dataKey={`temp_${pid}`}
                    name={pInfo.shortName}
                    stroke={pInfo.color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                );
              })}
            </ComposedChart>
          ) : viewMode === 'rain' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="rainAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
              <XAxis
                dataKey="displayTime"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                interval={timeRange > 48 ? 11 : timeRange === 48 ? 3 : 1}
              />
              <YAxis
                width={40}
                tick={{ fontSize: 11, fill: '#06b6d4', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${val}%`}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="averageRainProb"
                name={t.legendRainfallProb}
                stroke="#0891b2"
                strokeWidth={2.5}
                fill="url(#rainAreaGrad)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 15, left: 5, bottom: 0 }}>
              <defs>
                <linearGradient id="windAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
              <XAxis
                dataKey="displayTime"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                interval={timeRange > 48 ? 11 : timeRange === 48 ? 3 : 1}
              />
              <YAxis
                width={55}
                tick={{ fontSize: 11, fill: '#0d9488', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${val} ${windUnit === 'mph' ? 'mph' : 'km/h'}`}
                domain={[0, 'dataMax + 5']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="windSpeed"
                name={`${t.legendWindSpeed} (${windUnit === 'mph' ? 'mph' : 'km/h'})`}
                stroke="#0f766e"
                strokeWidth={2.5}
                fill="url(#windAreaGrad)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>

      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
        <Info className="w-4 h-4 text-blue-500 shrink-0" />
        <span>{t.proTip}</span>
      </div>
    </div>
  );
};
