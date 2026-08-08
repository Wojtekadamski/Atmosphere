import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { FavoritesBar } from './components/FavoritesBar';
import { WeatherHeaderCard } from './components/WeatherHeaderCard';
import { HourlyWeatherGraph } from './components/HourlyWeatherGraph';
import { ProviderComparisonCards } from './components/ProviderComparisonCards';
import { DailyForecastCard } from './components/DailyForecastCard';
import { Location, WeatherAggregatedData, TempUnit, WindUnit, Language } from './types';
import { DEFAULT_FAVORITES } from './constants/providers';
import { TRANSLATIONS } from './constants/translations';
import { Loader2, AlertTriangle, Layers } from 'lucide-react';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<Location>(DEFAULT_FAVORITES[0]);
  const [favorites, setFavorites] = useState<Location[]>(() => {
    try {
      const saved = localStorage.getItem('atmosphere_favorites');
      return saved ? JSON.parse(saved) : DEFAULT_FAVORITES;
    } catch (e) {
      return DEFAULT_FAVORITES;
    }
  });

  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [windUnit, setWindUnit] = useState<WindUnit>('kmh');
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('atmosphere_lang');
      return (saved === 'pl' || saved === 'en') ? saved : 'en';
    } catch (e) {
      return 'en';
    }
  });

  const [weatherData, setWeatherData] = useState<WeatherAggregatedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  const handleToggleLang = () => {
    const nextLang: Language = lang === 'en' ? 'pl' : 'en';
    setLang(nextLang);
    try {
      localStorage.setItem('atmosphere_lang', nextLang);
    } catch (e) {
      console.error('Failed to save language setting:', e);
    }
  };

  // Sync favorites to localStorage
  const saveFavorites = (updated: Location[]) => {
    setFavorites(updated);
    try {
      localStorage.setItem('atmosphere_favorites', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  };

  const isCurrentFavorite = favorites.some(
    (f) =>
      f.id === currentLocation.id ||
      (f.latitude.toFixed(2) === currentLocation.latitude.toFixed(2) &&
        f.longitude.toFixed(2) === currentLocation.longitude.toFixed(2))
  );

  const toggleFavorite = (loc: Location) => {
    if (
      favorites.some(
        (f) =>
          f.id === loc.id ||
          (f.latitude.toFixed(2) === loc.latitude.toFixed(2) &&
            f.longitude.toFixed(2) === loc.longitude.toFixed(2))
      )
    ) {
      // Deleting from favorites
      const updated = favorites.filter(
        (f) =>
          f.id !== loc.id &&
          !(
            f.latitude.toFixed(2) === loc.latitude.toFixed(2) &&
            f.longitude.toFixed(2) === loc.longitude.toFixed(2)
          )
      );
      saveFavorites(updated);
      
      // If we deleted the current location, switch to another favorite
      if (
        currentLocation.id === loc.id ||
        (currentLocation.latitude.toFixed(2) === loc.latitude.toFixed(2) &&
          currentLocation.longitude.toFixed(2) === loc.longitude.toFixed(2))
      ) {
        if (updated.length > 0) {
          setCurrentLocation(updated[0]);
        }
      }
    } else {
      // Adding to favorites
      saveFavorites([...favorites, loc]);
    }
  };

  // Fetch forecast data for selected location
  const fetchWeather = useCallback(async (loc: Location, activeLang: Language) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        lat: loc.latitude.toString(),
        lon: loc.longitude.toString(),
        name: loc.name,
        region: loc.region || '',
        country: loc.country || '',
        countryCode: loc.countryCode || '',
        lang: activeLang,
      });

      const response = await fetch(`/api/weather?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to load multi-model forecast data');
      }

      const data: WeatherAggregatedData = await response.json();
      setWeatherData(data);
    } catch (err: any) {
      console.error('Error fetching weather:', err);
      setError(err.message || 'Error fetching forecast');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(currentLocation, lang);
  }, [currentLocation, lang, fetchWeather]);

  const handleSelectLocation = (loc: Location) => {
    setCurrentLocation(loc);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        onSelectLocation={handleSelectLocation}
        tempUnit={tempUnit}
        windUnit={windUnit}
        onToggleTempUnit={() => setTempUnit((prev) => (prev === 'C' ? 'F' : 'C'))}
        onToggleWindUnit={() => setWindUnit((prev) => (prev === 'kmh' ? 'mph' : 'kmh'))}
        currentLocationId={currentLocation.id}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Favorites Quick Navigation Bar */}
        <FavoritesBar
          favorites={favorites}
          currentLocation={currentLocation}
          onSelectFavorite={handleSelectLocation}
          onToggleFavorite={toggleFavorite}
          isCurrentFavorite={isCurrentFavorite}
          lang={lang}
        />

        {/* Loading Spinner State */}
        {loading && !weatherData && (
          <div className="w-full py-24 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 dark:text-blue-400" />
            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                {t.loadingTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.loadingSubtitle}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="w-full p-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-3xl text-rose-700 dark:text-rose-400 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">{t.errorTitle}</h4>
                <p className="text-xs">{error}</p>
              </div>
            </div>
            <button
              onClick={() => fetchWeather(currentLocation, lang)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {t.retry}
            </button>
          </div>
        )}

        {/* Main Content Dashboard */}
        {weatherData && (
          <div className="space-y-6 animate-fade-in">
            {/* 1. Header & Current Consensus Overview Card */}
            <WeatherHeaderCard
              data={weatherData}
              tempUnit={tempUnit}
              windUnit={windUnit}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={toggleFavorite}
              onRefresh={() => fetchWeather(currentLocation, lang)}
              loading={loading}
              lang={lang}
            />

            {/* 2. Main Interactive Hourly Graph (Temperature, Rainfall & Wind) */}
            <HourlyWeatherGraph
              hourlyData={weatherData.hourly}
              tempUnit={tempUnit}
              windUnit={windUnit}
              lang={lang}
            />

            {/* 4. Side-by-Side Service Provider Comparison Cards */}
            <ProviderComparisonCards
              current={weatherData.current}
              tempUnit={tempUnit}
              lang={lang}
            />

            {/* 5. 7-Day Multi-Model Daily Forecast */}
            <DailyForecastCard
              daily={weatherData.daily}
              tempUnit={tempUnit}
              lang={lang}
            />
          </div>
        )}
      </main>

      {/* Footer & Data Attribution */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Atmosphere Weather Aggregator
            </span>
            <span>— Precision Consensus Engine</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <span>{t.dataProvidedBy}:</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">Open-Meteo</span>
            <span>•</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">ECMWF IFS</span>
            <span>•</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">NOAA GFS</span>
            <span>•</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">DWD ICON</span>
            <span>•</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">MET Norway</span>
            <span>•</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">Météo-France</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
