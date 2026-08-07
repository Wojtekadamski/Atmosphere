import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Navigation, Clock } from 'lucide-react';
import { Location, Language } from '../types';
import { getCountryFlag } from '../utils/formatters';
import { TRANSLATIONS } from '../constants/translations';

interface CitySearchProps {
  onSelectLocation: (location: Location) => void;
  currentLocationId?: string | number;
  lang?: Language;
}

export const CitySearch: React.FC<CitySearchProps> = ({
  onSelectLocation,
  currentLocationId,
  lang = 'en',
}) => {
  const t = TRANSLATIONS[lang];
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<Location[]>([]);
  const [isLocating, setIsLocating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('atmosphere_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading recent searches', e);
    }
  }, []);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&lang=${lang}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error('Failed to search city:', err);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query, lang]);

  const handleSelect = (loc: Location) => {
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);

    // Save to recent searches
    const updated = [loc, ...recentSearches.filter((item) => item.id !== loc.id)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('atmosphere_recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(t.geoNotSupported);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`/api/reverse-geocode?lat=${latitude}&lon=${longitude}`);
          if (res.ok) {
            const data = await res.json();
            if (data.location) {
              handleSelect(data.location);
            }
          }
        } catch (e) {
          console.error('Reverse geocode error:', e);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLocating(false);
        alert(t.geoUnable);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          ) : (
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-24 py-2.5 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-100/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm font-medium shadow-xs"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold border border-blue-200/60 dark:border-blue-800/50 transition-all cursor-pointer disabled:opacity-50"
            title="GPS"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>
      </div>

      {/* Autocomplete Results Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto backdrop-blur-lg">
          {results.length > 0 ? (
            <div className="p-1.5 space-y-0.5">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t.matchingCities}
              </div>
              {results.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSelect(loc)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg leading-none">{getCountryFlag(loc.countryCode)}</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {loc.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {loc.region ? `${loc.region}, ` : ''}
                        {loc.country}
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim().length >= 2 && !loading ? (
            <div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              {t.noCityFound.replace('{query}', query)}
            </div>
          ) : recentSearches.length > 0 && !query ? (
            <div className="p-1.5 space-y-0.5">
              <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {t.recentSearches}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRecentSearches([]);
                    localStorage.removeItem('atmosphere_recent_searches');
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors lowercase font-normal"
                >
                  {t.clear}
                </button>
              </div>
              {recentSearches.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSelect(loc)}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{getCountryFlag(loc.countryCode)}</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {loc.name}, <span className="text-xs text-slate-400">{loc.country}</span>
                    </span>
                  </div>
                  <MapPin className="w-3.5 h-3.5 text-slate-400 opacity-60" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
