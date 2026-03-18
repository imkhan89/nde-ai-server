function extractVehicleInfo(text) {
  const words = text.toLowerCase().split(' ');

  let make = null;
  let model = null;
  let year = null;

  const makes = ['suzuki', 'toyota', 'honda', 'daihatsu', 'kia', 'hyundai'];

  for (let word of words) {
    if (makes.includes(word)) make = word;
    if (!isNaN(word) && word.length === 4) year = word;
  }

  if (make) {
    const index = words.indexOf(make);
    model = words[index + 1] || null;
  }

  return { make, model, year };
}

function cleanPart(part, vehicle) {
  let cleaned = part;

  if (vehicle.make) cleaned = cleaned.replace(vehicle.make, '');
  if (vehicle.model) cleaned = cleaned.replace(vehicle.model, '');
  if (vehicle.year) cleaned = cleaned.replace(vehicle.year, '');

  return cleaned.trim();
}

function parseMessage(text) {
  if (!text) return { intent: 'unknown' };

  const clean = text.toLowerCase().trim();

  if (['1','2','3','4','5','6','#'].includes(clean)) {
    return { intent: 'menu', value: clean };
  }

  const vehicle = extractVehicleInfo(clean);

  // MULTI PART SPLIT
  let parts = clean.split(/,|and|\+/).map(p => p.trim()).filter(Boolean);

  // CLEAN PARTS
  parts = parts.map(p => cleanPart(p, vehicle));

  return {
    intent: 'auto_parts',
    raw: clean,
    parts,
    vehicle
  };
}

module.exports = { parseMessage };
