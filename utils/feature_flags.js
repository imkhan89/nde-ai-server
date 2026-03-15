const flags = new Map();

export function enableFeature(name) {
  flags.set(name, true);
}

export function disableFeature(name) {
  flags.set(name, false);
}

export function isFeatureEnabled(name) {
  return flags.get(name) === true;
}

export function setFeature(name, value) {
  flags.set(name, Boolean(value));
}

export function listFeatures() {
  const result = {};

  for (const [key, value] of flags.entries()) {
    result[key] = value;
  }

  return result;
}

export default {
  enableFeature,
  disableFeature,
  isFeatureEnabled,
  setFeature,
  listFeatures
};
