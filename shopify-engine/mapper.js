// shopify-engine/mapper.js

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

// 🔥 PART → PRODUCT TYPE
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

// 🔥 POSITION DETECTION
function extractPosition(part) {
  if (!part) return null;

  part = part.toLowerCase();

  if (part.includes('front')) return 'front';
  if (part.includes('rear')) return 'rear';
  if (part.includes('left')) return 'left';
  if (part.includes('right')) return 'right';
  if (part.includes('upper')) return 'upper';
  if (part.includes('lower')) return 'lower';

  return null;
}

// 🔥 CLEAN PART NAME (REMOVE POSITION WORDS)
function cleanPartName(part) {
  if (!part) return part;

  return part
    .replace(/front|rear|left|right|upper|lower/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateProductLink(vehicle) {

  // 🔥 Extract + clean
  const position = extractPosition(vehicle.part);
  const cleanPart = cleanPartName(vehicle.part);

  const updatedVehicle = {
    ...vehicle,
    part: cleanPart,
    position: position
  };

  const baseUrl = 'https://www.ndestore.com/search?q=';

  const query = buildSearchQuery(updatedVehicle);
  const encodedQuery = encodeURIComponent(query);

  const productType = getProductType(cleanPart);

  let url = `${baseUrl}${encodedQuery}`;

  // 🔥 APPLY CATEGORY FILTER
  if (productType) {
    url += `&filter.p.product_type=${encodeURIComponent(productType)}`;
  }

  return url;
}

module.exports = {
  generateProductLink
};
