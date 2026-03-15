function tokenize(query = "") {
  if (!query) return [];

  return query
    .toLowerCase()
    .split(" ")
    .map(t => t.trim())
    .filter(Boolean);
}

export function parseQuery(query = "") {
  const tokens = tokenize(query);

  return {
    raw: query,
    tokens,
    length: tokens.length
  };
}

export default {
  parseQuery
};
