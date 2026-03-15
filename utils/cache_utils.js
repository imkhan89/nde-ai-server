/*
NDE Automotive AI
Cache Utilities
*/

const CACHE_STORE = new Map();

export function setCache(key, value, ttlMs = 60000) {

  if (!key) return;

  const expiry = Date.now() + ttlMs;

  CACHE_STORE.set(key, {
    value,
    expiry
  });

}

export function getCache(key) {

  if (!CACHE_STORE.has(key)) return null;

  const entry = CACHE_STORE.get(key);

  if (Date.now() > entry.expiry) {

    CACHE_STORE.delete(key);

    return null;

  }

  return entry.value;

}

export function deleteCache(key) {

  CACHE_STORE.delete(key);

}

export function clearCache() {

  CACHE_STORE.clear();

}

export function cacheSize() {

  return CACHE_STORE.size;

}
