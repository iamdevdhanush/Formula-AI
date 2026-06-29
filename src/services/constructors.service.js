import { fetchOpenF1 } from './api.js';
import { getCached, setCache, TTL } from './cache.js';
import { getConstructorStandings } from './standings.service.js';

export async function getConstructors() {
  const cacheKey = 'constructors:all';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data, error } = await fetchOpenF1('/teams');
  if (error || !data || data.length === 0) {
    return [];
  }

  const standings = await getConstructorStandings();
  const standingsMap = new Map(standings.map(s => [s.team, s]));

  const seen = new Set();
  const constructors = data
    .filter(t => {
      if (seen.has(t.team_name)) return false;
      seen.add(t.team_name);
      return true;
    })
    .map(t => {
      const st = standingsMap.get(t.team_name);
      return {
        id: (t.team_name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        name: t.team_name || 'Unknown',
        fullName: t.team_name || 'Unknown',
        color: t.team_colour ? `#${t.team_colour}` : '#666',
        accentColor: t.team_colour ? `#${t.team_colour}` : '#666',
        engine: 'Currently unavailable',
        base: 'Currently unavailable',
        principal: 'Currently unavailable',
        championships: 0,
        wins: st?.wins || 0,
        points: st?.points || 0,
        position: st?.pos || 99,
        drivers: [],
        founded: 0,
      };
    })
    .sort((a, b) => a.position - b.position);

  setCache(cacheKey, constructors, TTL.CONSTRUCTORS);
  return constructors;
}
