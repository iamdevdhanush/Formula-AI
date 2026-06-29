import { fetchOpenF1 } from './api.js';
import { getCached, setCache, TTL } from './cache.js';

export async function getDriverStandings() {
  const cacheKey = 'standings:drivers';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data, error } = await fetchOpenF1('/standings', { type: 'driver' });
  if (error || !data || data.length === 0) {
    return [];
  }

  const seen = new Set();
  const standings = data
    .filter(s => {
      if (seen.has(s.driver_number)) return false;
      seen.add(s.driver_number);
      return true;
    })
    .sort((a, b) => (a.position || 999) - (b.position || 999))
    .slice(0, 20)
    .map((s, i) => ({
      pos: i + 1,
      driver_number: s.driver_number,
      driver: s.full_name || `${s.first_name} ${s.last_name}`,
      team: s.team_name || 'Unknown',
      teamColor: s.team_colour ? `#${s.team_colour}` : '#666',
      points: s.points || 0,
      wins: s.wins || 0,
      flag: getCountryFlag(s.country_code),
      number: s.driver_number,
    }));

  setCache(cacheKey, standings, TTL.STANDINGS);
  return standings;
}

export async function getConstructorStandings() {
  const cacheKey = 'standings:constructors';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data, error } = await fetchOpenF1('/standings', { type: 'team' });
  if (error || !data || data.length === 0) {
    return [];
  }

  const seen = new Set();
  const standings = data
    .filter(s => {
      if (seen.has(s.team_name)) return false;
      seen.add(s.team_name);
      return true;
    })
    .sort((a, b) => (a.position || 999) - (b.position || 999))
    .map((s, i) => ({
      pos: i + 1,
      team: s.team_name || 'Unknown',
      color: s.team_colour ? `#${s.team_colour}` : '#666',
      points: s.points || 0,
      wins: s.wins || 0,
    }));

  setCache(cacheKey, standings, TTL.STANDINGS);
  return standings;
}

function getCountryFlag(code) {
  if (!code) return '';
  const mapping = {
    'NED': '🇳🇱', 'GBR': '🇬🇧', 'MON': '🇲🇨', 'AUS': '🇦🇺',
    'ESP': '🇪🇸', 'THA': '🇹🇭', 'JPN': '🇯🇵', 'MEX': '🇲🇽',
    'CAN': '🇨🇦', 'FRA': '🇫🇷', 'GER': '🇩🇪', 'ITA': '🇮🇹',
    'BRA': '🇧🇷', 'NZL': '🇳🇿', 'USA': '🇺🇸', 'BEL': '🇧🇪',
    'DEN': '🇩🇰', 'FIN': '🇫🇮', 'AUT': '🇦🇹', 'CHN': '🇨🇳',
    'RUS': '🇷🇺', 'ARG': '🇦🇷', 'COL': '🇨🇴', 'ZAF': '🇿🇦',
    'SAU': '🇸🇦', 'ARE': '🇦🇪', 'QAT': '🇶🇦', 'SGP': '🇸🇬',
    'HUN': '🇭🇺', 'AZE': '🇦🇿', 'BHR': '🇧🇭',
  };
  return mapping[code] || '';
}
