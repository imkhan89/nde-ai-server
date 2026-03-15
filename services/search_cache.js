const cache = new Map();

const DEFAULT_TTL = 1000 * 60 * 10;

function setCache(key, value, ttl = DEFAULT_TTL) {
  const expires = Date.now() + ttl;

  cache.set(key, {
    value,
    expires
  });
}

function getCache(key) {
  const item = cache.get(key);

  if (!item) return null;

  if (Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }

  return item.value;
}

function clearCache() {
  cache.clear();
}

function deleteCache(key) {
  cache.delete(key);
}

export {
  setCache,
  getCache,
  clearCache,
  deleteCache
};

export default {
  setCache,
  getCache,
  clearCache,
  deleteCache
};
