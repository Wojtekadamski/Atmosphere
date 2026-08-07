import { TempUnit, WindUnit, Language } from '../types';

export function formatTemp(celsius: number, unit: TempUnit): string {
  if (isNaN(celsius)) return '--°';
  if (unit === 'F') {
    const fahrenheit = Math.round((celsius * 9) / 5 + 32);
    return `${fahrenheit}°F`;
  }
  return `${Math.round(celsius * 10) / 10}°C`;
}

export function formatTempNumber(celsius: number, unit: TempUnit): number {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius * 10) / 10;
}

export function formatWind(kmh: number, unit: WindUnit): string {
  if (isNaN(kmh)) return '--';
  if (unit === 'mph') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatWindNumber(kmh: number, unit: WindUnit): number {
  if (isNaN(kmh)) return 0;
  if (unit === 'mph') {
    return Math.round(kmh * 0.621371);
  }
  return Math.round(kmh);
}

export function getWindCardinal(degrees: number, lang: Language = 'en'): string {
  if (isNaN(degrees)) return 'N';
  const normDeg = ((degrees % 360) + 360) % 360;
  
  if (lang === 'pl') {
    const cardinalsPL = [
      'Pn', 'Pn-Pst', 'Pn-Wsch', 'Wsch-Pn',
      'Wsch', 'Wsch-Płd', 'Płd-Wsch', 'Płd-Pst',
      'Płd', 'Płd-Zach', 'Płd-Zach', 'Zach-Płd',
      'Zach', 'Zach-Pn', 'Pn-Zach', 'Pn-Pn-Zach'
    ];
    // 8-point is cleaner for UI labels:
    const simplePL = ['Pn', 'Pn-Wsch', 'Wsch', 'Płd-Wsch', 'Płd', 'Płd-Zach', 'Zach', 'Pn-Zach'];
    const idx = Math.round(normDeg / 45) % 8;
    return simplePL[idx];
  }

  const simpleEN = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round(normDeg / 45) % 8;
  return simpleEN[idx];
}

export function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
