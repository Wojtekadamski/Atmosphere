import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const lat = req.query.lat as string;
    const lon = req.query.lon as string;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    const url = `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.results && data.results.length > 0) {
      const item = data.results[0];
      return res.json({
        location: {
          id: `custom-${lat}-${lon}`,
          name: item.name,
          region: item.admin1 || item.country || '',
          country: item.country || '',
          countryCode: item.country_code || '',
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          timezone: item.timezone || 'UTC',
        },
      });
    }

    res.json({
      location: {
        id: `loc-${lat}-${lon}`,
        name: 'Current Location',
        region: 'GPS Coordinates',
        country: '',
        countryCode: '',
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      },
    });
  } catch (error) {
    res.json({
      location: {
        id: `loc-fallback`,
        name: 'My Location',
        region: '',
        country: '',
        countryCode: '',
        latitude: parseFloat(req.query.lat as string),
        longitude: parseFloat(req.query.lon as string),
        timezone: 'UTC',
      },
    });
  }
}
