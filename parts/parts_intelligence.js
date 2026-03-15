const PART_SYNONYMS = {
  "brake pads": ["brake pad", "brakepads", "disc pads", "disc brake pad"],
  "air filter": ["airfilter", "engine air filter"],
  "oil filter": ["oilfilter", "engine oil filter"],
  "cabin filter": ["ac filter", "cabin ac filter", "pollen filter"],
  "spark plug": ["sparkplug", "plug", "engine plug"],
  "wiper blade": ["wiper", "wipers", "windshield wiper"],
  "radiator cap": ["rad cap"],
  "horn": ["car horn"],
  "bumper": ["front bumper", "rear bumper"]
};

function normalize(text = "") {
  return text.toLowerCase();
}

export function detectParts(query = "") {
  const q = normalize(query);
  const detected = [];

  for (const part in PART_SYNONYMS) {
    const variants = PART_SYNONYMS[part];

    if (q.includes(part)) {
      detected.push(part);
      continue;
    }

    for (const v of variants) {
      if (q.includes(v)) {
        detected.push(part);
        break;
      }
    }
  }

  return detected;
}

export function getAllParts() {
  return Object.keys(PART_SYNONYMS);
}

export function getSynonyms(part) {
  return PART_SYNONYMS[part] || [];
}

export default {
  detectParts,
  getAllParts,
  getSynonyms
};
