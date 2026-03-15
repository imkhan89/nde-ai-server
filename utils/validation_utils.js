export function isString(value) {
  return typeof value === "string";
}

export function isNumber(value) {
  return typeof value === "number" && !isNaN(value);
}

export function isArray(value) {
  return Array.isArray(value);
}

export function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isEmpty(value) {
  if (value === null || value === undefined) return true;

  if (typeof value === "string") return value.trim() === "";

  if (Array.isArray(value)) return value.length === 0;

  if (typeof value === "object") return Object.keys(value).length === 0;

  return false;
}

export default {
  isString,
  isNumber,
  isArray,
  isObject,
  isEmpty
};
