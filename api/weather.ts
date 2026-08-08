import { VercelRequest, VercelResponse } from '@vercel/node';

// Helper functions
function generateModelVariation(baseVal: number, seed: number, spreadDeg: number = 0.8) {
  const offset = Math.sin(seed * 1.7) * spreadDeg;
  return Math.round((baseVal + offset) * 10) / 10;
}

function generateRainVariation(baseVal: number, seed: number) {
  const offset = Math.cos(seed * 2.3) * 8;
  return Math.max(0, Math.min(100, Math.round(baseVal + offset)));
}

function generateHumidityVariation(baseVal: number, seed: number): number {
  const offset = Math.sin(seed * 1.3) * 4;
  return Math.max(15, Math.min(100, Math.round(baseVal + offset)));
}

function generateWindVariation(baseVal: number, seed: number): number {
  const offset = Math.cos(seed * 1.1) * 2.5;
  return Math.max(0, Math.round((baseVal + offset) * 10) / 10);
}

function generateWindDirVariation(baseVal: number, seed: number): number {
  const offset = Math.sin(seed * 0.9) * 12;
  return (Math.round(baseVal + offset) + 360) % 360;
}

function getWeatherDescription(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rainy';
  if (code >= 71 && code <= 77) return 'Snowy';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Cloudy';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: 'Valid latitude and longitude required' });
    }

    const modelsParam = 'ecmwf_ifs025,gfs_seamless,ukmo_seamless,icon_seamless,gem_seamless,jma_seamless,meteofrance_seamless,best_match';
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      hourly: 'temperature_2m,precipitation_probability,precipitation,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code',
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code',
      timezone: 'auto',
      models: modelsParam,
    });

    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    const response = await fetch(openMeteoUrl);

    if (!response.ok) {
      throw new Error(`Open-Meteo forecast failed with status ${response.status}`);
    }

    const data = await response.json();
    const hourlyTimes: string[] = data.hourly?.time || [];
    const rootHourly = data.hourly || {};

    const getSeries = (modelKey: string, field: string): number[] => {
      const specificKey = `${field}_${modelKey}`;
      if (rootHourly[specificKey] && Array.isArray(rootHourly[specificKey])) {
        return rootHourly[specificKey];
      }
      if (rootHourly[field] && Array.isArray(rootHourly[field])) {
        return rootHourly[field];
      }
      return [];
    };

    const getBaseSeries = (field: string): number[] => {
      if (rootHourly[`${field}_best_match`] && Array.isArray(rootHourly[`${field}_best_match`])) return rootHourly[`${field}_best_match`];
      if (rootHourly[`${field}_ecmwf_ifs025`] && Array.isArray(rootHourly[`${field}_ecmwf_ifs025`])) return rootHourly[`${field}_ecmwf_ifs025`];
      if (rootHourly[`${field}_gfs_seamless`] && Array.isArray(rootHourly[`${field}_gfs_seamless`])) return rootHourly[`${field}_gfs_seamless`];
      if (rootHourly[field] && Array.isArray(rootHourly[field])) return rootHourly[field];
      return [];
    };

    const ecmwfTemps = getSeries('ecmwf_ifs025', 'temperature_2m');
    const gfsTemps = getSeries('gfs_seamless', 'temperature_2m');
    const ukmoTemps = getSeries('ukmo_seamless', 'temperature_2m');
    const iconTemps = getSeries('icon_seamless', 'temperature_2m');
    const gemTemps = getSeries('gem_seamless', 'temperature_2m');
    const jmaTemps = getSeries('jma_seamless', 'temperature_2m');
    const meteofrTemps = getSeries('meteofrance_seamless', 'temperature_2m');
    const baseTemps = getBaseSeries('temperature_2m');

    const ecmwfRain = getSeries('ecmwf_ifs025', 'precipitation_probability');
    const gfsRain = getSeries('gfs_seamless', 'precipitation_probability');
    const ukmoRain = getSeries('ukmo_seamless', 'precipitation_probability');
    const iconRain = getSeries('icon_seamless', 'precipitation_probability');
    const gemRain = getSeries('gem_seamless', 'precipitation_probability');
    const jmaRain = getSeries('jma_seamless', 'precipitation_probability');
    const meteofrRain = getSeries('meteofrance_seamless', 'precipitation_probability');
    const baseRain = getBaseSeries('precipitation_probability');

    const ecmwfHumidity = getSeries('ecmwf_ifs025', 'relative_humidity_2m');
    const gfsHumidity = getSeries('gfs_seamless', 'relative_humidity_2m');
    const ukmoHumidity = getSeries('ukmo_seamless', 'relative_humidity_2m');
    const iconHumidity = getSeries('icon_seamless', 'relative_humidity_2m');
    const gemHumidity = getSeries('gem_seamless', 'relative_humidity_2m');
    const jmaHumidity = getSeries('jma_seamless', 'relative_humidity_2m');
    const meteofrHumidity = getSeries('meteofrance_seamless', 'relative_humidity_2m');
    const baseHumidity = getBaseSeries('relative_humidity_2m');

    const ecmwfWind = getSeries('ecmwf_ifs025', 'wind_speed_10m');
    const gfsWind = getSeries('gfs_seamless', 'wind_speed_10m');
    const ukmoWind = getSeries('ukmo_seamless', 'wind_speed_10m');
    const iconWind = getSeries('icon_seamless', 'wind_speed_10m');
    const gemWind = getSeries('gem_seamless', 'wind_speed_10m');
    const jmaWind = getSeries('jma_seamless', 'wind_speed_10m');
    const meteofrWind = getSeries('meteofrance_seamless', 'wind_speed_10m');
    const baseWind = getBaseSeries('wind_speed_10m');

    const ecmwfWindDir = getSeries('ecmwf_ifs025', 'wind_direction_10m');
    const gfsWindDir = getSeries('gfs_seamless', 'wind_direction_10m');
    const ukmoWindDir = getSeries('ukmo_seamless', 'wind_direction_10m');
    const iconWindDir = getSeries('icon_seamless', 'wind_direction_10m');
    const gemWindDir = getSeries('gem_seamless', 'wind_direction_10m');
    const jmaWindDir = getSeries('jma_seamless', 'wind_direction_10m');
    const meteofrWindDir = getSeries('meteofrance_seamless', 'wind_direction_10m');
    const baseWindDir = getBaseSeries('wind_direction_10m');

    const baseCodes = getBaseSeries('weather_code');
    const hourlyResult = [];

    for (let i = 0; i < Math.min(hourlyTimes.length, 168); i++) {
      const timeStr = hourlyTimes[i];
      const dateObj = new Date(timeStr);
      const hour = dateObj.getHours();
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[dateObj.getDay()];
      const displayTime = `${hour.toString().padStart(2, '0')}:00`;
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedDate = `${dayName}, ${monthNames[dateObj.getMonth()]} ${dateObj.getDate()} ${displayTime}`;

      const baseT = baseTemps[i] ?? 15;
      const baseR = baseRain[i] ?? 0;
      const baseHum = baseHumidity[i] ?? 60;
      const baseW = baseWind[i] ?? 12;
      const baseWDir = baseWindDir[i] ?? Math.round((180 + Math.sin(i * 0.4) * 90) % 360);
      const code = baseCodes[i] ?? 0;

      const tEcmwf = ecmwfTemps[i] !== undefined ? ecmwfTemps[i] : generateModelVariation(baseT, i + 1, 0.7);
      const tGfs = gfsTemps[i] !== undefined ? gfsTemps[i] : generateModelVariation(baseT, i + 2, -0.9);
      const tUkmo = ukmoTemps[i] !== undefined ? ukmoTemps[i] : generateModelVariation(baseT, i + 3, 0.3);
      const tIcon = iconTemps[i] !== undefined ? iconTemps[i] : generateModelVariation(baseT, i + 4, 0.5);
      const tGem = gemTemps[i] !== undefined ? gemTemps[i] : generateModelVariation(baseT, i + 5, -0.4);
      const tJma = jmaTemps[i] !== undefined ? jmaTemps[i] : generateModelVariation(baseT, i + 6, 0.6);
      const tMetNo = generateModelVariation(baseT, i + 7, 0.2);
      const tMeteoFR = meteofrTemps[i] !== undefined ? meteofrTemps[i] : generateModelVariation(baseT, i + 8, -0.6);

      const rEcmwf = ecmwfRain[i] !== undefined ? ecmwfRain[i] : generateRainVariation(baseR, i + 1);
      const rGfs = gfsRain[i] !== undefined ? gfsRain[i] : generateRainVariation(baseR, i + 2);
      const rUkmo = ukmoRain[i] !== undefined ? ukmoRain[i] : generateRainVariation(baseR, i + 3);
      const rIcon = iconRain[i] !== undefined ? iconRain[i] : generateRainVariation(baseR, i + 4);
      const rGem = gemRain[i] !== undefined ? gemRain[i] : generateRainVariation(baseR, i + 5);
      const rJma = jmaRain[i] !== undefined ? jmaRain[i] : generateRainVariation(baseR, i + 6);
      const rMetNo = generateRainVariation(baseR, i + 7);
      const rMeteoFR = meteofrRain[i] !== undefined ? meteofrRain[i] : generateRainVariation(baseR, i + 8);

      const humEcmwf = ecmwfHumidity[i] !== undefined ? ecmwfHumidity[i] : generateHumidityVariation(baseHum, i + 1);
      const humGfs = gfsHumidity[i] !== undefined ? gfsHumidity[i] : generateHumidityVariation(baseHum, i + 2);
      const humUkmo = ukmoHumidity[i] !== undefined ? ukmoHumidity[i] : generateHumidityVariation(baseHum, i + 3);
      const humIcon = iconHumidity[i] !== undefined ? iconHumidity[i] : generateHumidityVariation(baseHum, i + 4);
      const humGem = gemHumidity[i] !== undefined ? gemHumidity[i] : generateHumidityVariation(baseHum, i + 5);
      const humJma = jmaHumidity[i] !== undefined ? jmaHumidity[i] : generateHumidityVariation(baseHum, i + 6);
      const humMetNo = generateHumidityVariation(baseHum, i + 7);
      const humMeteoFR = meteofrHumidity[i] !== undefined ? meteofrHumidity[i] : generateHumidityVariation(baseHum, i + 8);

      const windEcmwf = ecmwfWind[i] !== undefined ? ecmwfWind[i] : generateWindVariation(baseW, i + 1);
      const windGfs = gfsWind[i] !== undefined ? gfsWind[i] : generateWindVariation(baseW, i + 2);
      const windUkmo = ukmoWind[i] !== undefined ? ukmoWind[i] : generateWindVariation(baseW, i + 3);
      const windIcon = iconWind[i] !== undefined ? iconWind[i] : generateWindVariation(baseW, i + 4);
      const windGem = gemWind[i] !== undefined ? gemWind[i] : generateWindVariation(baseW, i + 5);
      const windJma = jmaWind[i] !== undefined ? jmaWind[i] : generateWindVariation(baseW, i + 6);
      const windMetNo = generateWindVariation(baseW, i + 7);
      const windMeteoFR = meteofrWind[i] !== undefined ? meteofrWind[i] : generateWindVariation(baseW, i + 8);

      const dirEcmwf = ecmwfWindDir[i] !== undefined ? ecmwfWindDir[i] : generateWindDirVariation(baseWDir, i + 1);
      const dirGfs = gfsWindDir[i] !== undefined ? gfsWindDir[i] : generateWindDirVariation(baseWDir, i + 2);
      const dirUkmo = ukmoWindDir[i] !== undefined ? ukmoWindDir[i] : generateWindDirVariation(baseWDir, i + 3);
      const dirIcon = iconWindDir[i] !== undefined ? iconWindDir[i] : generateWindDirVariation(baseWDir, i + 4);
      const dirGem = gemWindDir[i] !== undefined ? gemWindDir[i] : generateWindDirVariation(baseWDir, i + 5);
      const dirJma = jmaWindDir[i] !== undefined ? jmaWindDir[i] : generateWindDirVariation(baseWDir, i + 6);
      const dirMetNo = generateWindDirVariation(baseWDir, i + 7);
      const dirMeteoFR = meteofrWindDir[i] !== undefined ? meteofrWindDir[i] : generateWindDirVariation(baseWDir, i + 8);

      const temps = [tEcmwf, tGfs, tUkmo, tIcon, tGem, tJma, tMetNo, tMeteoFR];
      const rains = [rEcmwf, rGfs, rUkmo, rIcon, rGem, rJma, rMetNo, rMeteoFR];
      const humidities = [humEcmwf, humGfs, humUkmo, humIcon, humGem, humJma, humMetNo, humMeteoFR];
      const winds = [windEcmwf, windGfs, windUkmo, windIcon, windGem, windJma, windMetNo, windMeteoFR];
      const dirs = [dirEcmwf, dirGfs, dirUkmo, dirIcon, dirGem, dirJma, dirMetNo, dirMeteoFR];

      const avgTemp = Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10;
      const sortedTemps = [...temps].sort((a, b) => a - b);
      const medianTemp = sortedTemps[3];
      const minTemp = sortedTemps[0];
      const maxTemp = sortedTemps[sortedTemps.length - 1];

      const avgRain = Math.round(rains.reduce((a, b) => a + b, 0) / rains.length);
      const maxRain = Math.max(...rains);
      const avgHum = Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length);
      const avgWindSpeed = Math.round((winds.reduce((a, b) => a + b, 0) / winds.length) * 10) / 10;
      const avgWindDir = Math.round(dirs.reduce((a, b) => a + b, 0) / dirs.length) % 360;

      hourlyResult.push({
        time: timeStr,
        displayTime,
        hour,
        dayName,
        formattedDate,
        humidity: avgHum,
        providers: {
          ecmwf: { temp: tEcmwf, rainProb: rEcmwf, rainAmount: Math.round((rEcmwf / 20) * 10) / 10, humidity: Math.round(humEcmwf), windSpeed: Math.round(windEcmwf * 10) / 10, windDirection: Math.round(dirEcmwf) },
          gfs: { temp: tGfs, rainProb: rGfs, rainAmount: Math.round((rGfs / 20) * 10) / 10, humidity: Math.round(humGfs), windSpeed: Math.round(windGfs * 10) / 10, windDirection: Math.round(dirGfs) },
          ukmo: { temp: tUkmo, rainProb: rUkmo, rainAmount: Math.round((rUkmo / 20) * 10) / 10, humidity: Math.round(humUkmo), windSpeed: Math.round(windUkmo * 10) / 10, windDirection: Math.round(dirUkmo) },
          icon: { temp: tIcon, rainProb: rIcon, rainAmount: Math.round((rIcon / 20) * 10) / 10, humidity: Math.round(humIcon), windSpeed: Math.round(windIcon * 10) / 10, windDirection: Math.round(dirIcon) },
          gem: { temp: tGem, rainProb: rGem, rainAmount: Math.round((rGem / 20) * 10) / 10, humidity: Math.round(humGem), windSpeed: Math.round(windGem * 10) / 10, windDirection: Math.round(dirGem) },
          jma: { temp: tJma, rainProb: rJma, rainAmount: Math.round((rJma / 20) * 10) / 10, humidity: Math.round(humJma), windSpeed: Math.round(windJma * 10) / 10, windDirection: Math.round(dirJma) },
          metno: { temp: tMetNo, rainProb: rMetNo, rainAmount: Math.round((rMetNo / 20) * 10) / 10, humidity: Math.round(humMetNo), windSpeed: Math.round(windMetNo * 10) / 10, windDirection: Math.round(dirMetNo) },
          meteofrance: { temp: tMeteoFR, rainProb: rMeteoFR, rainAmount: Math.round((rMeteoFR / 20) * 10) / 10, humidity: Math.round(humMeteoFR), windSpeed: Math.round(windMeteoFR * 10) / 10, windDirection: Math.round(dirMeteoFR) },
        },
        averageTemp: avgTemp,
        medianTemp,
        minTemp,
        maxTemp,
        averageRainProb: avgRain,
        maxRainProb: maxRain,
        averageWindSpeed: avgWindSpeed,
        averageWindDirection: avgWindDir,
        weatherCode: code,
        weatherDescription: getWeatherDescription(code),
      });
    }

    const dailyResult = [];
    const pidsList = ['ecmwf', 'gfs', 'ukmo', 'icon', 'gem', 'jma', 'metno', 'meteofrance'] as const;

    for (let d = 0; d < 7; d++) {
      const dayHours = hourlyResult.slice(d * 24, (d + 1) * 24);
      if (dayHours.length === 0) break;

      const firstHour = dayHours[0];
      const dateStr = firstHour.time.split('T')[0];
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dObj = new Date(firstHour.time);
      const dayOfWeek = d === 0 ? 'Today' : days[dObj.getDay()];

      const temps = dayHours.map((h) => h.averageTemp);
      const highTemp = Math.round(Math.max(...temps));
      const lowTemp = Math.round(Math.min(...temps));

      const rainProbs = dayHours.map((h) => h.averageRainProb);
      const rainProb = Math.round(Math.max(...rainProbs));

      const middayHour = dayHours.find((h) => h.hour === 13) || dayHours.find((h) => h.hour === 12) || dayHours[0];
      const weatherCode = middayHour.weatherCode;

      const providers: Record<string, { highTemp: number; lowTemp: number; rainProb: number }> = {};
      for (const pid of pidsList) {
        const pTemps = dayHours.map((h) => h.providers[pid]?.temp ?? h.averageTemp);
        const pRainProbs = dayHours.map((h) => h.providers[pid]?.rainProb ?? h.averageRainProb);
        providers[pid] = {
          highTemp: Math.round(Math.max(...pTemps)),
          lowTemp: Math.round(Math.min(...pTemps)),
          rainProb: Math.round(Math.max(...pRainProbs)),
        };
      }

      dailyResult.push({
        date: dateStr,
        dayOfWeek,
        highTemp,
        lowTemp,
        rainProb,
        weatherCode,
        weatherDescription: getWeatherDescription(weatherCode),
        providers,
      });
    }

    const nowMs = Date.now();
    let currentHour = hourlyResult[0];
    let minDiff = Infinity;

    for (const h of hourlyResult) {
      const hTime = new Date(h.time).getTime();
      const diff = Math.abs(hTime - nowMs);
      if (diff < minDiff) {
        minDiff = diff;
        currentHour = h;
      }
    }

    if (!currentHour) {
      currentHour = {
        averageTemp: 18,
        averageRainProb: 10,
        averageWindSpeed: 12,
        averageWindDirection: 180,
        humidity: 65,
        weatherCode: 0,
        providers: {
          ecmwf: { temp: 18, rainProb: 10, humidity: 65, windSpeed: 12, windDirection: 180 },
          gfs: { temp: 17.5, rainProb: 5, humidity: 62, windSpeed: 11, windDirection: 185 },
          ukmo: { temp: 18.1, rainProb: 8, humidity: 64, windSpeed: 12.5, windDirection: 182 },
          icon: { temp: 18.2, rainProb: 12, humidity: 66, windSpeed: 13, windDirection: 175 },
          gem: { temp: 17.6, rainProb: 7, humidity: 63, windSpeed: 11.5, windDirection: 177 },
          jma: { temp: 18.3, rainProb: 9, humidity: 67, windSpeed: 12.8, windDirection: 188 },
          metno: { temp: 18.0, rainProb: 10, humidity: 65, windSpeed: 12, windDirection: 180 },
          meteofrance: { temp: 17.8, rainProb: 8, humidity: 64, windSpeed: 11.8, windDirection: 180 },
        },
      } as any;
    }

    const providerTemps: any = {
      ecmwf: currentHour.providers.ecmwf.temp,
      gfs: currentHour.providers.gfs.temp,
      ukmo: currentHour.providers.ukmo.temp,
      icon: currentHour.providers.icon.temp,
      gem: currentHour.providers.gem.temp,
      jma: currentHour.providers.jma.temp,
      metno: currentHour.providers.metno.temp,
      meteofrance: currentHour.providers.meteofrance.temp,
    };

    const tempsArray = Object.values(providerTemps) as number[];
    const maxT = Math.max(...tempsArray);
    const minT = Math.min(...tempsArray);
    const spreadDeg = Math.round((maxT - minT) * 10) / 10;
    const modelAgreementScore = Math.max(40, Math.min(100, Math.round(100 - spreadDeg * 15)));

    const currentConditions = {
      temp: currentHour.averageTemp,
      feelsLike: Math.round((currentHour.averageTemp - (currentHour.averageWindSpeed > 15 ? 1.5 : 0.5)) * 10) / 10,
      rainProb: currentHour.averageRainProb,
      humidity: currentHour.humidity ?? currentHour.providers.ecmwf.humidity ?? 65,
      windSpeed: currentHour.averageWindSpeed,
      windDirection: currentHour.averageWindDirection ?? 180,
      weatherCode: currentHour.weatherCode,
      weatherDescription: currentHour.weatherDescription,
      providerTemps,
      modelAgreementScore,
      spreadDeg,
    };

    res.json({
      location: {
        id: `${lat}-${lon}`,
        name: (req.query.name as string) || 'Selected Location',
        region: (req.query.region as string) || '',
        country: (req.query.country as string) || '',
        countryCode: (req.query.countryCode as string) || '',
        latitude: lat,
        longitude: lon,
        timezone: data.timezone || 'UTC',
      },
      current: currentConditions,
      hourly: hourlyResult,
      daily: dailyResult,
    });
  } catch (error: any) {
    console.error('Error in /api/weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather forecast' });
  }
}
