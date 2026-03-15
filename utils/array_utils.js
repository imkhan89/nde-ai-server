/*
NDE Automotive AI
Array Utilities
*/

export function uniqueArray(arr = []) {

  if (!Array.isArray(arr)) return [];

  return [...new Set(arr)];

}

export function chunkArray(arr = [], size = 100) {

  const chunks = [];

  for (let i = 0; i < arr.length; i += size) {

    chunks.push(arr.slice(i, i + size));

  }

  return chunks;

}

export function sortByKey(arr = [], key) {

  if (!Array.isArray(arr)) return [];

  return [...arr].sort((a, b) => {

    const aVal = a?.[key];
    const bVal = b?.[key];

    if (aVal === bVal) return 0;

    if (aVal === undefined) return 1;
    if (bVal === undefined) return -1;

    return aVal > bVal ? 1 : -1;

  });

}

export function groupBy(arr = [], key) {

  const result = {};

  for (const item of arr) {

    const groupKey = item?.[key];

    if (!result[groupKey]) {

      result[groupKey] = [];

    }

    result[groupKey].push(item);

  }

  return result;

}
