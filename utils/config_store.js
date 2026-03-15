const config = new Map();

export function setConfig(key, value) {
  config.set(key, value);
}

export function getConfig(key, defaultValue = null) {
  if (config.has(key)) {
    return config.get(key);
  }
  return defaultValue;
}

export function hasConfig(key) {
  return config.has(key);
}

export function removeConfig(key) {
  config.delete(key);
}

export function clearConfig() {
  config.clear();
}

export default {
  setConfig,
  getConfig,
  hasConfig,
  removeConfig,
  clearConfig
};
