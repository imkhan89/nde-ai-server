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

// 🔥 ADVANCED POSITION + SIDE DETECTION
function extractPositionAndSide(part) {
  if (!part) return null;

  const text = part.toLowerCase();

  const hasFront = text.includes('front');
  const hasRear = text.includes('rear');
  const hasLeft = text.includes('left');
  const hasRight = text.includes('right');
  const hasUpper = text.includes('upper');
  const hasLower = text.includes('lower');

  let positionParts = [];

  if (hasFront) positionParts.push('front');
  if (hasRear) positionParts.push('rear');

  if (hasLeft) positionParts.push('left');
  if (hasRight) positionParts.push('right');

  if (hasUpper) positionParts.push('upper');
  if (hasLower) positionParts.push('lower');

  if (positionParts.length === 0) return null;

  return positionParts.join(' ');
}

// 🔥 CLEAN PART NAME
function cleanPartName(part) {
  if (!part) return part;

  return part
    .replace(/front|rear|left|right|upper|lower/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateProductLink(vehicle) {

  // 🔥 Extract combined position
  const position = extractPositionAndSide(vehicle.part);

  // 🔥 Clean part
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
