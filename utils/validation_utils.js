/*
NDE Automotive AI
Validation Utilities
*/

export function isString(value) {

  return typeof value === "string";

}

export function isNumber(value) {

  return typeof value === "number" && !Number.isNaN(value);

}

export function isObject(value) {

  return value !== null && typeof value === "object" && !Array.isArray(value);

}

export function isArray(value) {

  return Array.isArray(value);

}

export function isEmpty(value) {

  if (value === null || value === undefined) return true;

  if (isString(value)) return value.trim().length === 0;

  if (isArray(value)) return value.length === 0;

  if (isObject(value)) return Object.keys(value).length === 0;

  return false;

}

export function isValidYear(year) {

  const y = Number(year);

  if (Number.isNaN(y)) return false;

  return y >= 1980 && y <= 2035;

}

export function isValidPrice(price) {

  const p = Number(price);

  if (Number.isNaN(p)) return false;

  return p >= 0;

}
