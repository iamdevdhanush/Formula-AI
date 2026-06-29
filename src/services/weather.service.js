import { fetchOpenF1 } from './api.js';
import { getCached, setCache, TTL } from './cache.js';

function getCondition(rainfall, temp) {
  if (rainfall > 0.5) return 'Rainy';
  if (rainfall > 0.1) return 'Light Rain';
  if (temp > 25) return 'Sunny';
  if (temp > 15) return 'Partly Cloudy';
  return 'Cloudy';
}

function getWeatherIcon(rainfall) {
  if (rainfall > 0.5) return '\u{1F327}';
  if (rainfall > 0.1) return '\u{1F326}';
  return '\u2600';
}

export async function getSessionWeather(sessionKey) {
  if (!sessionKey) return null;
  const cacheKey = 'weather:session:' + sessionKey;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data, error } = await fetchOpenF1('/weather', { session_key: sessionKey });
  if (error || !data || data.length === 0) return null;

  const latest = data[data.length - 1];
  const weather = {
    condition: getCondition(latest.rainfall, latest.air_temperature),
    icon: getWeatherIcon(latest.rainfall),
    temp: latest.air_temperature ?? 'N/A',
    humidity: latest.humidity ?? 0,
    wind: latest.wind_direction ? (latest.wind_speed ?? 0) + ' km/h' : 'N/A',
    rain: latest.rainfall ?? 0,
    trackTemp: latest.track_temperature ?? 'N/A',
  };
  setCache(cacheKey, weather, TTL.WEATHER);
  return weather;
}

export async function getLocationWeather(lat, lon) {
  if (!lat || !lon) return null;
  const cacheKey = 'weather:loc:' + lat + ':' + lon;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,relative_humidity_2m,rain,weather_code,wind_speed_10m&timezone=auto';
  const { data, error } = await fetchExternal(url);
  if (error || !data || !data.current) return null;

  const cur = data.current;
  const weatherCodes = {
    0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Foggy', 51: 'Light Drizzle', 53: 'Drizzle',
    61: 'Light Rain', 63: 'Rain', 71: 'Light Snow', 80: 'Rain Showers',
    95: 'Thunderstorm',
  };

  const weather = {
    condition: weatherCodes[cur.weather_code] || 'Unknown',
    icon: cur.weather_code >= 80 ? '\u{1F327}' : cur.weather_code >= 61 ? '\u{1F327}' : cur.weather_code >= 45 ? '\u{1F32B}' : '\u2600',
    temp: cur.temperature_2m ?? 'N/A',
    humidity: cur.relative_humidity_2m ?? 0,
    wind: cur.wind_speed_10m ? cur.wind_speed_10m + ' km/h' : 'N/A',
    rain: cur.rain ?? 0,
    trackTemp: 'N/A',
  };
  setCache(cacheKey, weather, TTL.WEATHER);
  return weather;
}

async function fetchExternal(url) {
  try {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return { data: null, error: 'HTTP ' + res.status };
    return { data: await res.json(), error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}
