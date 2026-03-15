/*
NDE Automotive AI
Search Cache Engine

Caches frequent search queries
to dramatically improve response speed.
Self-optimizing and auto-cleaning.
*/

const CACHE = new Map();

const MAX_CACHE_SIZE = 1000;

const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

function now() {
  return Date.now();
}

/*
Get cached search result
*/

export function getCachedSearch(query) {

  const entry = CACHE.get(query);

  if (!entry) return null;

  if (now() - entry.time > CACHE_TTL) {

    CACHE.delete(query);

    return null;

  }

  return entry.data;

}

/*
Store cache
*/

export function setCachedSearch(query, data) {

  if (!query) return;

  if (CACHE.size > MAX_CACHE_SIZE) {

    const firstKey = CACHE.keys().next().value;

    CACHE.delete(firstKey);

  }

  CACHE.set(query, {
    data,
    time: now()
  });

}

/*
Clear cache
*/

export function clearSearchCache() {

  CACHE.clear();

}

/*
Cache stats
*/

export function getCacheStats() {

  return {
    size: CACHE.size,
    max: MAX_CACHE_SIZE,
    ttl_minutes: CACHE_TTL / 60000
  };

}
