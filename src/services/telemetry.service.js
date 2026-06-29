import { fetchOpenF1 } from './api.js';
import { getCached, setCache, TTL } from './cache.js';

export async function getCarData(sessionKey, driverNumber) {
  if (!sessionKey) return [];
  const cacheKey = 'car_data:' + sessionKey + ':' + (driverNumber || 'all');
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const params = { session_key: sessionKey };
  if (driverNumber) params.driver_number = driverNumber;

  const { data, error } = await fetchOpenF1('/car_data', params);
  if (error || !data) return [];

  setCache(cacheKey, data, TTL.WEATHER);
  return data;
}

export async function getLapData(sessionKey, driverNumber) {
  if (!sessionKey) return [];
  const cacheKey = 'laps:' + sessionKey + ':' + (driverNumber || 'all');
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const params = { session_key: sessionKey };
  if (driverNumber) params.driver_number = driverNumber;

  const { data, error } = await fetchOpenF1('/laps', params);
  if (error || !data) return [];

  setCache(cacheKey, data, TTL.WEATHER);
  return data;
}

export async function getPitData(sessionKey) {
  if (!sessionKey) return [];
  const cacheKey = 'pit:' + sessionKey;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data, error } = await fetchOpenF1('/pit', { session_key: sessionKey });
  if (error || !data) return [];

  setCache(cacheKey, data, TTL.WEATHER);
  return data;
}
