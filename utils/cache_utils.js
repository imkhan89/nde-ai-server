const cacheStore = new Map();

export function setCache(key, value, ttl = 300000) {
  const expiresAt = Date.now() + ttl;

  cacheStore.set(key, {
    value,
    expiresAt
  });
}

export function getCache(key) {
  const item = cacheStore.get(key);

  if (!item) return null;

  if (Date.now() > item.expiresAt) {
    cacheStore.delete(key);
    return null;
  }

  return item.value;
}

export function deleteCache(key) {
  cacheStore.delete(key);
}

export function clearCache() {
  cacheStore.clear();
}

export default {
  setCache,
  getCache,
  deleteCache,
  clearCache
};
