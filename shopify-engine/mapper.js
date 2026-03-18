const { normalizePart } = require('../ai-engine/normalizer');

function buildSearchQuery(vehicle) {
  const { make, model, year, part, position } = vehicle;

  let queryParts = [];

  if (make) queryParts.push(make);
  if (model) queryParts.push(model);
  if (part) queryParts.push(part);
  if (position) queryParts.push(position);
  if (year) queryParts.push(year);

  return queryParts.join(' ');
}

// PRODUCT TYPE MAPPING
function getProductType(part) {
  if (!part) return null;

  if (part.includes('brake')) return 'Brake Pads';
  if (part.includes('air filter')) return 'Air Filters';
  if (part.includes('oil filter')) return 'Oil Filters';
  if (part.includes('cabin filter')) return 'Cabin Filters';
  if (part.includes('spark')) return 'Spark Plugs';
  if (part.includes('shock')) return 'Shock Absorbers';
  if (part.includes('control arm')) return 'Control Arms';

  return null;
}

// POSITION + SIDE
function extractPositionAndSide(part) {
  if (!part) return null;

  const text = part.toLowerCase();

  let pos = [];

  if (text.includes('front')) pos.push('front');
  if (text.includes('rear')) pos.push('rear');
  if (text.includes('left')) pos.push('left');
  if (text.includes('right')) pos.push('right');
  if (text.includes('upper')) pos.push('upper');
  if (text.includes('lower')) pos.push('lower');

  return pos.length ? pos.join(' ') : null;
}

// CLEAN PART
function cleanPartName(part) {
  if (!part) return part;

  return part
    .replace(/front|rear|left|right|upper|lower/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateProductLink(vehicle) {

  // 🔥 Normalize first
  let normalizedPart = normalizePart(vehicle.part);

  // 🔥 Extract position
  const position = extractPositionAndSide(normalizedPart);

  // 🔥 Clean part
  const cleanPart = cleanPartName(normalizedPart);

  const updatedVehicle = {
    ...vehicle,
    part: cleanPart,
    position
  };

  const baseUrl = 'https://www.ndestore.com/search?q=';

  const query = buildSearchQuery(updatedVehicle);
  const encodedQuery = encodeURIComponent(query);

  const productType = getProductType(cleanPart);

  let url = `${baseUrl}${encodedQuery}`;

  if (productType) {
    url += `&filter.p.product_type=${encodeURIComponent(productType)}`;
  }

  return url;
}

module.exports = {
  generateProductLink
};
