/*
NDE Automotive AI
Memory Cache
*/

class MemoryCache {

  constructor() {

    this.store = new Map();

  }

  set(key, value, ttlMs = 60000) {

    const expires = Date.now() + ttlMs;

    this.store.set(key, {
      value,
      expires
    });

  }

  get(key) {

    const entry = this.store.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expires) {

      this.store.delete(key);

      return null;

    }

    return entry.value;

  }

  delete(key) {

    this.store.delete(key);

  }

  clear() {

    this.store.clear();

  }

  size() {

    return this.store.size;

  }

}

export const memoryCache = new MemoryCache();
