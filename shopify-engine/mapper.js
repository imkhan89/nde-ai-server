// shopify-engine/mapper.js

function buildSearchQuery(vehicle) {
  const { make, model, year, part } = vehicle;

  let queryParts = [];

  if (make) queryParts.push(make);
  if (model) queryParts.push(model);
  if (part) queryParts.push(part);
  if (year) queryParts.push(year);

  return queryParts.join(' ');
}

// 🔥 PART → SHOPIFY CATEGORY MAPPING
function getProductType(part) {
  if (!part) return null;

  part = part.toLowerCase();

  if (part.includes('brake pad')) return 'Brake Pads';
  if (part.includes('brake shoe')) return 'Brake Shoe';
  if (part.includes('air filter')) return 'Air Filters';
  if (part.includes('oil filter')) return 'Oil Filters';
  if (part.includes('cabin filter')) return 'Cabin Filters';
  if (part.includes('spark plug')) return 'Spark Plugs';
  if (part.includes('radiator')) return 'Radiators';
  if (part.includes('shock')) return 'Shock Absorbers';
  if (part.includes('control arm')) return 'Control Arms';
  if (part.includes('ball joint')) return 'Ball Joints';

  return null;
}

function generateProductLink(vehicle) {
  const baseUrl = 'https://www.ndestore.com/search?q=';

  const query = buildSearchQuery(vehicle);
  const encodedQuery = encodeURIComponent(query);

  const productType = getProductType(vehicle.part);

  // 🔥 WITH CATEGORY FILTER
  if (productType) {
    const encodedType = encodeURIComponent(productType);
    return `${baseUrl}${encodedQuery}&filter.p.product_type=${encodedType}`;
  }

  // fallback
  return `${baseUrl}${encodedQuery}`;
}

module.exports = {
  generateProductLink
};
