export interface Location {
  id: string | number;
  name: string;
  region: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population?: number;
}

export type ProviderId = 'ecmwf' | 'gfs' | 'ukmo' | 'icon' | 'gem' | 'jma' | 'metno' | 'meteofrance';

export interface WeatherProvider {
  id: ProviderId;
  name: string;
  shortName: string;
  organization: string;
  color: string;
  accentBg: string;
  badgeBorder: string;
  description: string;
}

export interface ProviderHourData {
  temp: number; // in Celsius
  rainProb: number; // 0-100%
  rainAmount: number; // in mm
  humidity: number; // 0-100%
  windSpeed: number; // in km/h
  windDirection?: number; // 0-360 degrees
}

export interface HourlyPoint {
  time: string; // ISO string
  displayTime: string; // e.g. "14:00"
  hour: number;
  dayName: string; // e.g. "Mon"
  formattedDate: string; // e.g. "Aug 8, 14:00"
  providers: Record<ProviderId, ProviderHourData>;
  averageTemp: number;
  medianTemp: number;
  minTemp: number;
  maxTemp: number;
  averageRainProb: number;
  maxRainProb: number;
  averageWindSpeed: number;
  averageWindDirection: number;
  weatherCode: number;
  weatherDescription: string;
}

export interface DailyPoint {
  date: string;
  dayOfWeek: string;
  highTemp: number;
  lowTemp: number;
  rainProb: number;
  weatherCode: number;
  weatherDescription: string;
  providers: Record<ProviderId, { highTemp: number; lowTemp: number; rainProb: number }>;
}

export interface CurrentConditions {
  temp: number; // average
  feelsLike: number;
  rainProb: number;
  humidity: number;
  windSpeed: number;
  windDirection: number; // in degrees (0-360)
  weatherCode: number;
  weatherDescription: string;
  providerTemps: Record<ProviderId, number>;
  modelAgreementScore: number; // percentage 0-100
  spreadDeg: number; // temperature spread between models in °C
}

export interface WeatherAggregatedData {
  location: Location;
  current: CurrentConditions;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  aiSummary?: {
    summary: string;
    consensusRating: 'High' | 'Moderate' | 'Low Divergence';
    keyInsights: string[];
    clothingAdvice: string;
  };
}

export type TempUnit = 'C' | 'F';
export type WindUnit = 'kmh' | 'mph';
export type Language = 'en' | 'pl';
export type GraphViewMode = 'aggregated' | 'all' | 'rain' | 'combined' | 'wind';
export type TimeRange = 24 | 48 | 168; // hours

export interface WeatherCodeInfo {
  description: string;
  iconName: string;
}
