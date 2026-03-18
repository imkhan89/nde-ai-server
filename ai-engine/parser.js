function extractVehicleInfo(text) {
  const words = text.toLowerCase().split(' ');

  let make = null;
  let model = null;
  let year = null;
  let part = null;

  const makes = ['suzuki', 'toyota', 'honda', 'daihatsu', 'kia', 'hyundai'];

  for (let word of words) {
    if (makes.includes(word)) make = word;
    if (!isNaN(word) && word.length === 4) year = word;
  }

  // simple model detection (next word after make)
  if (make) {
    const index = words.indexOf(make);
    model = words[index + 1] || null;
  }

  // part = remaining words
  part = words.filter(w => w !== make && w !== model && w !== year).join(' ');

  return { make, model, year, part };
}

function parseMessage(text) {
  if (!text) return { intent: 'unknown' };

  const clean = text.toLowerCase().trim();

  if (['1','2','3','4','5','6','#'].includes(clean)) {
    return { intent: 'menu', value: clean };
  }

  const parts = clean.split(/,|and|\+/).map(p => p.trim());

  const vehicle = extractVehicleInfo(clean);

  return {
    intent: 'auto_parts',
    raw: clean,
    parts,
    vehicle
  };
}

module.exports = { parseMessage };
