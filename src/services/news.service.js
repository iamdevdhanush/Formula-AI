import { fetchOpenF1 } from './api.js';
import { getCached, setCache, TTL } from './cache.js';

function getCountryFlag(code) {
  if (!code) return '';
  const m = {
    'BHR': '\u{1F1E7}\u{1F1ED}', 'SAU': '\u{1F1F8}\u{1F1E6}', 'AUS': '\u{1F1E6}\u{1F1FA}',
    'JPN': '\u{1F1EF}\u{1F1F5}', 'CHN': '\u{1F1E8}\u{1F1F3}', 'USA': '\u{1F1FA}\u{1F1F8}',
    'ITA': '\u{1F1EE}\u{1F1F9}', 'MON': '\u{1F1F2}\u{1F1E8}', 'CAN': '\u{1F1E8}\u{1F1E6}',
    'ESP': '\u{1F1EA}\u{1F1F8}', 'AUT': '\u{1F1E6}\u{1F1F9}', 'GBR': '\u{1F1EC}\u{1F1E7}',
    'HUN': '\u{1F1ED}\u{1F1FA}', 'BEL': '\u{1F1E7}\u{1F1EA}', 'NED': '\u{1F1F3}\u{1F1F1}',
    'AZE': '\u{1F1E6}\u{1F1FF}', 'SGP': '\u{1F1F8}\u{1F1EC}', 'MEX': '\u{1F1F2}\u{1F1FD}',
    'BRA': '\u{1F1E7}\u{1F1F7}', 'QAT': '\u{1F1F6}\u{1F1E6}', 'ARE': '\u{1F1E6}\u{1F1EA}',
  };
  return m[code] || '';
}

export async function getNews() {
  const cacheKey = 'news:all';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data, error } = await fetchOpenF1('/race_control', { limit: 50 });
  if (error || !data || data.length === 0) {
    return getFallbackNews();
  }

  const articles = data
    .filter(m => m.message && m.message.length > 20)
    .slice(0, 20)
    .map((m, i) => ({
      id: i + 1,
      category: getCategory(m.category || m.flag || 'General'),
      title: m.message.substring(0, 80) + (m.message.length > 80 ? '...' : ''),
      summary: m.message.substring(0, 150) + (m.message.length > 150 ? '...' : ''),
      time: formatTimeAgo(m.date),
      readTime: '2 min read',
      source: 'FIA Race Control',
      author: 'Race Control',
      image: null,
    }));

  if (articles.length === 0) return getFallbackNews();

  setCache(cacheKey, articles, TTL.NEWS);
  return articles;
}

function getCategory(type) {
  const map = {
    'Car': 'Technical',
    'Driver': 'Driver',
    'Track': 'Circuit',
    'Safety': 'Safety',
    'Flag': 'Race Control',
    'Weather': 'Weather',
    'Penalty': 'Incident',
    'General': 'Update',
  };
  return map[type] || 'Update';
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return 'Just now';
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

function getFallbackNews() {
  return [];
}
