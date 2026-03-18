// ai-engine/normalizer.js

function normalizePart(part) {
  if (!part) return part;

  part = part.toLowerCase();

  const map = {
    'brake pad': 'brake pads',
    'brake pads': 'brake pads',
    'pad': 'brake pads',

    'air filter': 'air filter',
    'engine air filter': 'air filter',

    'oil filter': 'oil filter',

    'ac filter': 'cabin filter',
    'cabin filter': 'cabin filter',

    'plug': 'spark plugs',
    'spark plug': 'spark plugs',

    'shock': 'shock absorber',
    'shock absorber': 'shock absorber',

    'control arm': 'control arm',
    'arm': 'control arm',

    'ball joint': 'ball joint'
  };

  for (let key in map) {
    if (part.includes(key)) {
      return map[key];
    }
  }

  return part;
}

module.exports = { normalizePart };
