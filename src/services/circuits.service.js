import { fetchOpenF1 } from './api.js';
import { getCached, setCache, TTL } from './cache.js';

export async function getCircuits() {
  const cacheKey = 'circuits:all';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data, error } = await fetchOpenF1('/circuits');
  if (error || !data || data.length === 0) {
    return [];
  }

  const seen = new Set();
  const circuits = data
    .filter(c => {
      if (!c.circuit_name || seen.has(c.circuit_name)) return false;
      seen.add(c.circuit_name);
      return true;
    })
    .map(c => ({
      id: (c.circuit_name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: c.circuit_name || 'Unknown',
      country: c.country_name || c.country_code || 'Unknown',
      flag: getCountryFlag(c.country_code),
      race: `${c.circuit_name || ''} GP`,
      lapRecord: {
        time: 'Currently unavailable',
        driver: '',
        year: '',
      },
      length: 'Currently unavailable',
      turns: 0,
      drsZones: 0,
      firstGP: 0,
    }));

  setCache(cacheKey, circuits, TTL.CIRCUITS);
  return circuits;
}

function getCountryFlag(code) {
  if (!code) return '';
  const mapping = {
    'BHR': '🇧🇭', 'SAU': '🇸🇦', 'AUS': '🇦🇺', 'JPN': '🇯🇵',
    'CHN': '🇨🇳', 'USA': '🇺🇸', 'ITA': '🇮🇹', 'MON': '🇲🇨',
    'CAN': '🇨🇦', 'ESP': '🇪🇸', 'AUT': '🇦🇹', 'GBR': '🇬🇧',
    'HUN': '🇭🇺', 'BEL': '🇧🇪', 'NED': '🇳🇱', 'AZE': '🇦🇿',
    'SGP': '🇸🇬', 'MEX': '🇲🇽', 'BRA': '🇧🇷', 'QAT': '🇶🇦',
    'ARE': '🇦🇪', 'FRA': '🇫🇷', 'POR': '🇵🇹', 'TUR': '🇹🇷',
  };
  return mapping[code] || '';
}
