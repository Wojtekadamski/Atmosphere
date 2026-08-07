import { ProviderId, WeatherProvider } from '../types';

export const WEATHER_PROVIDERS: Record<ProviderId, WeatherProvider> = {
  ecmwf: {
    id: 'ecmwf',
    name: 'ECMWF IFS',
    shortName: 'ECMWF',
    organization: 'European Centre for Medium-Range Weather Forecasts',
    color: '#3b82f6', // Blue
    accentBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    badgeBorder: 'border-blue-500',
    description: 'Gold standard global numerical weather prediction model.',
  },
  gfs: {
    id: 'gfs',
    name: 'NOAA GFS',
    shortName: 'GFS',
    organization: 'US National Oceanic & Atmospheric Administration',
    color: '#10b981', // Emerald
    accentBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    badgeBorder: 'border-emerald-500',
    description: 'Premier American global forecast framework.',
  },
  ukmo: {
    id: 'ukmo',
    name: 'UK Met Office',
    shortName: 'UKMO',
    organization: 'United Kingdom Meteorological Office',
    color: '#14b8a6', // Teal
    accentBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30',
    badgeBorder: 'border-teal-500',
    description: 'Premier British high-precision global numerical prediction system.',
  },
  icon: {
    id: 'icon',
    name: 'DWD ICON',
    shortName: 'ICON',
    organization: 'Deutscher Wetterdienst (Germany)',
    color: '#f59e0b', // Amber
    accentBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    badgeBorder: 'border-amber-500',
    description: 'High-resolution non-hydrostatic global grid system.',
  },
  gem: {
    id: 'gem',
    name: 'Environment Canada',
    shortName: 'GEM',
    organization: 'Canadian Meteorological Centre (CMC)',
    color: '#f97316', // Orange
    accentBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
    badgeBorder: 'border-orange-500',
    description: 'Global Environmental Multiscale Model by Meteorological Service of Canada.',
  },
  jma: {
    id: 'jma',
    name: 'Japan Met Agency',
    shortName: 'JMA',
    organization: 'Japan Meteorological Agency',
    color: '#06b6d4', // Cyan
    accentBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    badgeBorder: 'border-cyan-500',
    description: 'Asian-Pacific high-resolution global spectral numerical weather model.',
  },
  metno: {
    id: 'metno',
    name: 'MET Norway',
    shortName: 'MET Norway',
    organization: 'Norwegian Meteorological Institute',
    color: '#8b5cf6', // Purple
    accentBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    badgeBorder: 'border-purple-500',
    description: 'Renowned Nordic high-precision weather simulation.',
  },
  meteofrance: {
    id: 'meteofrance',
    name: 'Météo-France',
    shortName: 'Météo-FR',
    organization: 'French National Meteorological Service',
    color: '#ec4899', // Pink
    accentBg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30',
    badgeBorder: 'border-pink-500',
    description: 'Western European regional & global precision model.',
  },
};

export const DEFAULT_FAVORITES = [
  {
    id: 'london-uk',
    name: 'London',
    region: 'Greater London',
    country: 'United Kingdom',
    countryCode: 'GB',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
  },
  {
    id: 'tokyo-jp',
    name: 'Tokyo',
    region: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 'new-york-us',
    name: 'New York',
    region: 'New York',
    country: 'United States',
    countryCode: 'US',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
  },
  {
    id: 'paris-fr',
    name: 'Paris',
    region: 'Île-de-France',
    country: 'France',
    countryCode: 'FR',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
  },
  {
    id: 'sydney-au',
    name: 'Sydney',
    region: 'New South Wales',
    country: 'Australia',
    countryCode: 'AU',
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: 'Australia/Sydney',
  },
];

export function getWmoWeatherInfo(code: number): { description: string; icon: string } {
  switch (code) {
    case 0:
      return { description: 'Clear sky', icon: 'Sun' };
    case 1:
      return { description: 'Mainly clear', icon: 'SunCloud' };
    case 2:
      return { description: 'Partly cloudy', icon: 'CloudSun' };
    case 3:
      return { description: 'Overcast', icon: 'Cloud' };
    case 45:
    case 48:
      return { description: 'Foggy', icon: 'CloudFog' };
    case 51:
    case 53:
    case 55:
      return { description: 'Drizzle', icon: 'CloudDrizzle' };
    case 56:
    case 57:
      return { description: 'Freezing Drizzle', icon: 'Snowflake' };
    case 61:
      return { description: 'Slight Rain', icon: 'CloudRain' };
    case 63:
      return { description: 'Moderate Rain', icon: 'CloudRain' };
    case 65:
      return { description: 'Heavy Rain', icon: 'CloudRain' };
    case 66:
    case 67:
      return { description: 'Freezing Rain', icon: 'Snowflake' };
    case 71:
      return { description: 'Slight Snow', icon: 'CloudSnow' };
    case 73:
      return { description: 'Moderate Snow', icon: 'CloudSnow' };
    case 75:
      return { description: 'Heavy Snow', icon: 'Snowflake' };
    case 77:
      return { description: 'Snow grains', icon: 'CloudSnow' };
    case 80:
    case 81:
    case 82:
      return { description: 'Rain showers', icon: 'CloudRain' };
    case 85:
    case 86:
      return { description: 'Snow showers', icon: 'CloudSnow' };
    case 95:
      return { description: 'Thunderstorm', icon: 'CloudLightning' };
    case 96:
    case 99:
      return { description: 'Thunderstorm with hail', icon: 'CloudLightning' };
    default:
      return { description: 'Variable weather', icon: 'Sun' };
  }
}
