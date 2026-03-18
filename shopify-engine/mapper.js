function buildSearchQuery(vehicle) {
  const { make, model, year, part } = vehicle;

  let query = '';

  if (part) query += part + ' ';
  if (make) query += make + ' ';
  if (model) query += model + ' ';
  if (year) query += year;

  return query.trim();
}

function generateProductLink(vehicle) {
  const baseUrl = 'https://www.ndestore.com/search?q=';

  const query = buildSearchQuery(vehicle);

  const encoded = encodeURIComponent(query);

  return `${baseUrl}${encoded}`;
}

module.exports = {
  generateProductLink
};
