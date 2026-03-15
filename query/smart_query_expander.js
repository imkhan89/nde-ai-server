const SYNONYMS = {
  brake: ["brake", "brakes"],
  pad: ["pad", "pads"],
  filter: ["filter", "filters"],
  plug: ["plug", "plugs"],
  wiper: ["wiper", "wipers"],
  horn: ["horn", "horns"]
};

function expandToken(token) {
  for (const key in SYNONYMS) {
    if (SYNONYMS[key].includes(token)) {
      return SYNONYMS[key];
    }
  }

  return [token];
}

export function expandQuery(parsedQuery) {
  if (!parsedQuery || !parsedQuery.tokens) return "";

  const expanded = [];

  for (const token of parsedQuery.tokens) {
    const variants = expandToken(token);

    expanded.push(...variants);
  }

  return expanded.join(" ");
}

export default {
  expandQuery
};
