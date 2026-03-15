/*
NDE Automotive AI
Object Utilities
*/

export function deepClone(obj) {

  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  }

  const cloned = {};

  for (const key in obj) {

    if (Object.prototype.hasOwnProperty.call(obj, key)) {

      cloned[key] = deepClone(obj[key]);

    }

  }

  return cloned;

}

export function isEmptyObject(obj) {

  if (!obj || typeof obj !== "object") {
    return true;
  }

  return Object.keys(obj).length === 0;

}

export function pick(obj, keys = []) {

  const result = {};

  for (const key of keys) {

    if (key in obj) {

      result[key] = obj[key];

    }

  }

  return result;

}

export function omit(obj, keys = []) {

  const result = {};

  for (const key in obj) {

    if (!keys.includes(key)) {

      result[key] = obj[key];

    }

  }

  return result;

}
