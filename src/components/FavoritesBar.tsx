import React from 'react';
import { Star, Plus, Trash2 } from 'lucide-react';
import { Location, Language } from '../types';
import { getCountryFlag } from '../utils/formatters';
import { TRANSLATIONS } from '../constants/translations';

interface FavoritesBarProps {
  favorites: Location[];
  currentLocation: Location | null;
  onSelectFavorite: (location: Location) => void;
  onToggleFavorite: (location: Location) => void;
  isCurrentFavorite: boolean;
  lang?: Language;
}

export const FavoritesBar: React.FC<FavoritesBarProps> = ({
  favorites,
  currentLocation,
  onSelectFavorite,
  onToggleFavorite,
  isCurrentFavorite,
  lang = 'en',
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="w-full flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{t.favoritesLabel}:</span>
        </div>

        {favorites.map((fav) => {
          const isSelected = currentLocation?.id === fav.id || (
            currentLocation?.latitude.toFixed(2) === fav.latitude.toFixed(2) &&
            currentLocation?.longitude.toFixed(2) === fav.longitude.toFixed(2)
          );

          return (
            <button
              key={fav.id}
              onClick={() => onSelectFavorite(fav)}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <span>{getCountryFlag(fav.countryCode)}</span>
              <span>{fav.name}</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(fav);
                }}
                className={`p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${
                  isSelected ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-amber-500'
                }`}
                title={t.removeFromFavorites}
              >
                <Trash2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </button>
          );
        })}

        {currentLocation && !isCurrentFavorite && (
          <button
            onClick={() => onToggleFavorite(currentLocation)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.pinLocation.replace('{name}', currentLocation.name)}</span>
          </button>
        )}
      </div>
    </div>
  );
};
