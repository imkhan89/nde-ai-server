/*
NDE Automotive AI
Date Utilities
*/

export function now() {

  return new Date().toISOString();

}

export function timestamp() {

  return Date.now();

}

export function minutesToMs(minutes) {

  if (!minutes) return 0;

  return minutes * 60 * 1000;

}

export function secondsToMs(seconds) {

  if (!seconds) return 0;

  return seconds * 1000;

}

export function isExpired(time, ttlMs) {

  if (!time || !ttlMs) return true;

  return Date.now() - time > ttlMs;

}

export function formatUptime(seconds) {

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${hrs}h ${mins}m ${secs}s`;

}
