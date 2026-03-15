let CACHE = {}

export function setCache(key, value) {
  CACHE[key] = value
}

export function getCache(key) {
  return CACHE[key]
}

export function clearCache() {
  CACHE = {}
}
