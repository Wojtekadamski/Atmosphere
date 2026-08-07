import React from 'react';
import { Layers, Globe } from 'lucide-react';
import { CitySearch } from './CitySearch';
import { Location, TempUnit, WindUnit, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface NavbarProps {
  onSelectLocation: (loc: Location) => void;
  tempUnit: TempUnit;
  windUnit: WindUnit;
  onToggleTempUnit: () => void;
  onToggleWindUnit: () => void;
  lang: Language;
  onToggleLang: () => void;
  currentLocationId?: string | number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectLocation,
  tempUnit,
  windUnit,
  onToggleTempUnit,
  onToggleWindUnit,
  lang,
  onToggleLang,
  currentLocationId,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  {t.appTitle}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  {t.aggregatorTag}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Unit & Lang Toggle Buttons on mobile */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={onToggleLang}
              className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-indigo-200 dark:border-indigo-800"
              title="Zmiana języka / Switch language"
            >
              <Globe className="w-3 h-3" />
              <span>{lang.toUpperCase()}</span>
            </button>
            <button
              onClick={onToggleTempUnit}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              °{tempUnit}
            </button>
            <button
              onClick={onToggleWindUnit}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              {windUnit}
            </button>
          </div>
        </div>

        {/* City Autocomplete Search Bar */}
        <div className="w-full md:w-1/2">
          <CitySearch
            onSelectLocation={onSelectLocation}
            currentLocationId={currentLocationId}
            lang={lang}
          />
        </div>

        {/* Desktop Unit & Language Toggle Controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-indigo-50/80 dark:bg-indigo-950/50 p-1 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80">
            <button
              onClick={onToggleLang}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 hover:bg-white dark:hover:bg-indigo-900 shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>{lang === 'en' ? 'EN ➔ PL' : 'PL ➔ EN'}</span>
            </button>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              onClick={() => tempUnit !== 'C' && onToggleTempUnit()}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tempUnit === 'C'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => tempUnit !== 'F' && onToggleTempUnit()}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tempUnit === 'F'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              onClick={() => windUnit !== 'kmh' && onToggleWindUnit()}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                windUnit === 'kmh'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              km/h
            </button>
            <button
              onClick={() => windUnit !== 'mph' && onToggleWindUnit()}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                windUnit === 'mph'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              mph
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
