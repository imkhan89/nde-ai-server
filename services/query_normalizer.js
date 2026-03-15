export function normalizeQuery(query) {
  if (!query) return "";

  let q = query.toLowerCase();

  const replacements = {
    rebirth: "civic 2012 2016",
    reborn: "civic 2006 2011",
    grande: "corolla 2014 2020",
    gli: "corolla",
    xli: "corolla"
  };

  for (const key in replacements) {
    if (q.includes(key)) {
      q = q.replace(key, replacements[key]);
    }
  }

  return q;
}
