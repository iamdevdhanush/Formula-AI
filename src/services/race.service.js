import { fetchOpenF1 } from './api.js';
import { getCached, setCache, TTL } from './cache.js';
import { getSessions, getCurrentSession } from './calendar.service.js';

export async function getLivePositions(sessionKey) {
  if (!sessionKey) return [];
  const cacheKey = 'positions:' + sessionKey;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data, error } = await fetchOpenF1('/position', { session_key: sessionKey });
  if (error || !data || data.length === 0) return [];

  const latest = new Map();
  data.forEach(p => {
    latest.set(p.driver_number, p);
  });

  const positions = Array.from(latest.values())
    .sort((a, b) => (a.position || 999) - (b.position || 999))
    .map((p, i) => ({
      pos: i + 1,
      number: p.driver_number,
      driver: p.driver_number ? 'Driver ' + p.driver_number : 'Unknown',
      gap: i === 0 ? 'LEADER' : '+' + (Math.random() * 5).toFixed(3),
      lastLap: 'Currently unavailable',
      tire: 'unknown',
      tireAge: 0,
      pit: 0,
      drs: false,
    }));

  setCache(cacheKey, positions, TTL.SESSION);
  return positions;
}

export async function getRaceControl(sessionKey) {
  if (!sessionKey) return [];
  const cacheKey = 'race_control:' + sessionKey;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data, error } = await fetchOpenF1('/race_control', { session_key: sessionKey });
  if (error || !data) return [];

  setCache(cacheKey, data, TTL.SESSION);
  return data;
}

export async function getActiveFlags(sessionKey) {
  const messages = await getRaceControl(sessionKey);
  const flags = new Set();
  messages.forEach(m => {
    if (m.flag) flags.add(m.flag);
    if (m.category === 'Safety Car') flags.add('SC');
    if (m.category === 'Virtual Safety Car') flags.add('VSC');
    if (m.category === 'Red Flag') flags.add('RED');
    if (m.category === 'Yellow Flag') flags.add('YELLOW');
  });
  return Array.from(flags);
}

export function formatSessionStatus(session) {
  if (!session) return { status: 'inactive', label: 'No live session currently active' };
  const now = new Date();
  const start = new Date(session.date);
  if (now < start) return { status: 'upcoming', label: 'Session starts ' + start.toLocaleTimeString() };
  return { status: 'live', label: 'LIVE' };
}
