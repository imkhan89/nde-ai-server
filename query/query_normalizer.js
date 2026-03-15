function normalizeQuery(query = "") {
  let q = query.toLowerCase();

  // remove special characters
  q = q.replace(/[^\w\s]/g, " ");

  // collapse multiple spaces
  q = q.replace(/\s+/g, " ").trim();

  return q;
}

export { normalizeQuery };

export default {
  normalizeQuery
};
