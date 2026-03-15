export function buildQueryString(params = {}) {
  const esc = encodeURIComponent;

  return Object.keys(params)
    .map(key => `${esc(key)}=${esc(params[key])}`)
    .join("&");
}

export function parseQueryString(query = "") {
  const result = {};

  if (!query) return result;

  const pairs = query.replace(/^\?/, "").split("&");

  for (const pair of pairs) {
    const [key, value] = pair.split("=");

    if (key) {
      result[decodeURIComponent(key)] = decodeURIComponent(value || "");
    }
  }

  return result;
}

export default {
  buildQueryString,
  parseQueryString
};
