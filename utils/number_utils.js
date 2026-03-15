/*
NDE Automotive AI
Number Utilities
*/

export function toNumber(value, fallback = 0) {

  const num = Number(value);

  if (Number.isNaN(num)) {
    return fallback;
  }

  return num;

}

export function clamp(value, min, max) {

  const num = toNumber(value);

  if (num < min) return min;

  if (num > max) return max;

  return num;

}

export function round(value, decimals = 2) {

  const num = toNumber(value);

  const factor = Math.pow(10, decimals);

  return Math.round(num * factor) / factor;

}

export function percentage(part, total) {

  const p = toNumber(part);
  const t = toNumber(total);

  if (t === 0) return 0;

  return (p / t) * 100;

}

export function average(arr = []) {

  if (!Array.isArray(arr) || arr.length === 0) {
    return 0;
  }

  const sum = arr.reduce((acc, n) => acc + toNumber(n), 0);

  return sum / arr.length;

}
