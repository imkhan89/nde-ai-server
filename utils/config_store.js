/*
NDE Automotive AI
Config Store
*/

class ConfigStore {

  constructor() {

    this.store = new Map();

  }

  set(key, value) {

    if (!key) return;

    this.store.set(key, value);

  }

  get(key, defaultValue = null) {

    if (!this.store.has(key)) {

      return defaultValue;

    }

    return this.store.get(key);

  }

  has(key) {

    return this.store.has(key);

  }

  delete(key) {

    this.store.delete(key);

  }

  clear() {

    this.store.clear();

  }

  entries() {

    return Array.from(this.store.entries());

  }

}

export const configStore = new ConfigStore();
