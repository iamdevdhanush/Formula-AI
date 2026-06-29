import { fetchOpenF1 } from './api.js';
import { getCached, setCache, TTL } from './cache.js';

export async function getSessions(year) {
  const y = year || new Date().getFullYear();
  const cacheKey = `calendar:sessions:${y}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const startDate = `${y}-01-01`;
  const endDate = `${y + 1}-01-01`;

  const { data, error } = await fetchOpenF1('/sessions', {
    date_start_after: startDate,
    date_start_before: endDate,
  });

  if (error || !data || data.length === 0) {
    return [];
  }

  const sessions = data.map(s => ({
    session_key: s.session_key,
    meeting_key: s.meeting_key,
    name: s.session_name || s.meeting_name || 'Session',
    type: getSessionType(s.session_type),
    date: s.date_start,
    endDate: s.date_end,
    circuit: s.location || s.circuit_name || 'Unknown',
    country: s.country_name || '',
    countryCode: s.country_code || '',
    flag: getCountryFlag(s.country_code),
    status: getSessionStatus(s.date_start, s.date_end),
  }));

  setCache(cacheKey, sessions, TTL.CALENDAR);
  return sessions;
}

export async function getCalendar() {
  const sessions = await getSessions();
  const meetings = groupByMeeting(sessions);
  return meetings;
}

export async function getNextRace() {
  const sessions = await getSessions();
  const now = new Date();
  const raceSessions = sessions.filter(s => s.type === 'Race');
  const upcoming = raceSessions.filter(s => new Date(s.date) > now);
  if (upcoming.length === 0) return null;
  return upcoming[0];
}

export async function getCurrentSession() {
  const sessions = await getSessions();
  const now = new Date();
  return sessions.find(s => {
    const start = new Date(s.date);
    const end = new Date(s.endDate || s.date);
    return now >= start && now <= end;
  }) || null;
}

function getSessionType(type) {
  const map = {
    'Race': 'Race',
    'Practice': 'Practice',
    'Practice 1': 'Practice',
    'Practice 2': 'Practice',
    'Practice 3': 'Practice',
    'Qualifying': 'Qualifying',
    'Sprint': 'Sprint',
    'Sprint Qualifying': 'Sprint',
    'Sprint Shootout': 'Sprint',
  };
  return map[type] || type || 'Session';
}

function getSessionStatus(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate || startDate);
  if (now > end) return 'completed';
  if (now >= start && now <= end) return 'live';
  return 'upcoming';
}

function groupByMeeting(sessions) {
  const meetings = new Map();
  sessions.forEach(s => {
    const key = s.meeting_key || s.name;
    if (!meetings.has(key)) {
      meetings.set(key, {
        meeting_key: s.meeting_key,
        name: s.name,
        country: s.country,
        countryCode: s.countryCode,
        flag: s.flag,
        date: s.date,
        status: s.status,
        sessions: [],
      });
    }
    const meeting = meetings.get(key);
    meeting.sessions.push(s);
    if (s.type === 'Race') {
      meeting.raceName = s.name;
      meeting.raceDate = s.date;
    }
    if (s.status === 'live') meeting.status = 'live';
    if (meeting.status !== 'live' && s.status === 'upcoming' && meeting.status !== 'completed') {
      meeting.status = 'upcoming';
    }
  });

  return Array.from(meetings.values())
    .sort((a, b) => new Date(a.date) - new Date(b.date));
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
