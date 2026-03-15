/*
NDE Automotive AI
URL Utilities
*/

export function buildQueryString(params = {}) {

  const parts = [];

  for (const key in params) {

    const value = params[key];

    if (value === undefined || value === null) {
      continue;
    }

    parts.push(
      encodeURIComponent(key) +
      "=" +
      encodeURIComponent(String(value))
    );

  }

  return parts.length ? "?" + parts.join("&") : "";

}

export function parseQueryString(query = "") {

  const params = {};

  const clean = query.startsWith("?")
    ? query.slice(1)
    : query;

  const pairs = clean.split("&");

  for (const pair of pairs) {

    if (!pair) continue;

    const [key, value] = pair.split("=");

    params[decodeURIComponent(key)] =
      decodeURIComponent(value || "");

  }

  return params;

}

export function isValidUrl(url) {

  try {

    new URL(url);

    return true;

  } catch {

    return false;

  }

}
