import { fetchOpenF1 } from './api.js';
import { getCached, setCache, TTL } from './cache.js';
import { getDriverStandings } from './standings.service.js';

export async function getDrivers() {
  const cacheKey = 'drivers:all';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data, error } = await fetchOpenF1('/drivers');
  if (error || !data || data.length === 0) {
    return [];
  }

  const standings = await getDriverStandings();
  const standingsMap = new Map(standings.map(s => [s.driver_number, s]));

  const seen = new Set();
  const drivers = data
    .filter(d => {
      if (!d.driver_number || seen.has(d.driver_number)) return false;
      seen.add(d.driver_number);
      return true;
    })
    .map(d => {
      const st = standingsMap.get(d.driver_number);
      return {
        id: (d.first_name || '').toLowerCase() + (d.last_name || '').toLowerCase(),
        number: d.driver_number,
        name: d.full_name || `${d.first_name || ''} ${d.last_name || ''}`.trim(),
        firstName: d.first_name || '',
        lastName: d.last_name || '',
        abbr: d.name_acronym || ((d.last_name || '').substring(0, 3).toUpperCase()),
        team: d.team_name || 'Unknown',
        teamColor: d.team_colour ? `#${d.team_colour}` : '#666',
        nationality: d.country_name || d.country_code || 'Unknown',
        flag: getCountryFlag(d.country_code),
        wins: d.wins || st?.wins || 0,
        podiums: 0,
        poles: 0,
        points: st?.points || 0,
        position: st?.pos || 99,
      };
    })
    .sort((a, b) => a.position - b.position);

  setCache(cacheKey, drivers, TTL.DRIVERS);
  return drivers;
}

function getCountryFlag(code) {
  if (!code) return '';
  const mapping = {
    'NED': '🇳🇱', 'GBR': '🇬🇧', 'MON': '🇲🇨', 'AUS': '🇦🇺',
    'ESP': '🇪🇸', 'THA': '🇹🇭', 'JPN': '🇯🇵', 'MEX': '🇲🇽',
    'CAN': '🇨🇦', 'FRA': '🇫🇷', 'GER': '🇩🇪', 'ITA': '🇮🇹',
    'BRA': '🇧🇷', 'NZL': '🇳🇿', 'USA': '🇺🇸', 'BEL': '🇧🇪',
    'DEN': '🇩🇰', 'FIN': '🇫🇮', 'AUT': '🇦🇹', 'CHN': '🇨🇳',
    'RUS': '🇷🇺', 'ARG': '🇦🇷', 'COL': '🇴', 'ZAF': '🇿🇦',
    'SAU': '🇸🇦', 'ARE': '🇦🇪', 'QAT': '🇶🇦', 'SGP': '🇸🇬',
    'HUN': '🇭🇺', 'AZE': '🇦🇿', 'BHR': '🇧🇭',
  };
  return mapping[code] || '';
}
