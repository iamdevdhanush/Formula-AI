const store = new Map();

export function getCached(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

export function setCache(key, data, ttlMs) {
  store.set(key, { data, expiry: Date.now() + ttlMs });
}

export function clearCache(key) {
  if (key) store.delete(key);
  else store.clear();
}

export const TTL = {
  STANDINGS: 15 * 60 * 1000,
  NEWS: 15 * 60 * 1000,
  CALENDAR: 24 * 60 * 60 * 1000,
  DRIVERS: 24 * 60 * 60 * 1000,
  CONSTRUCTORS: 24 * 60 * 60 * 1000,
  CIRCUITS: 30 * 24 * 60 * 60 * 1000,
  WEATHER: 10 * 60 * 1000,
  SESSION: 60 * 1000,
};
