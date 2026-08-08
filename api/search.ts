import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const q = req.query.q as string;
    const lang = (req.query.lang as string) === 'pl' ? 'pl' : 'en';

    if (!q || q.trim().length < 2) {
      return res.json({ results: [] });
    }

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q.trim())}&count=10&language=${lang}&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.results) {
      return res.json({ results: [] });
    }

    const formattedResults = data.results.map((item: any) => ({
      id: `${item.id}-${item.latitude}-${item.longitude}`,
      name: item.name,
      region: item.admin1 || item.admin2 || item.country || '',
      country: item.country || '',
      countryCode: item.country_code || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'UTC',
      population: item.population,
    }));

    res.json({ results: formattedResults });
  } catch (error: any) {
    console.error('Error in /api/search:', error);
    res.status(500).json({ error: 'Failed to search city' });
  }
}
