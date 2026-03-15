/*
NDE Automotive AI
Parts Intelligence Engine
Understands automotive part names and synonyms
Self-learning enabled
*/

const PART_SYNONYMS = {

  "brake pad": [
    "brake pad",
    "brake pads",
    "brakepad",
    "brakepads"
  ],

  "brake rotor": [
    "rotor",
    "rotors",
    "brake rotor",
    "brake rotors",
    "disc rotor",
    "disc rotors",
    "brake disc",
    "brake discs"
  ],

  "air filter": [
    "air filter",
    "engine air filter",
    "air cleaner"
  ],

  "oil filter": [
    "oil filter",
    "engine oil filter"
  ],

  "cabin filter": [
    "cabin filter",
    "ac filter",
    "cabin ac filter",
    "aircon filter"
  ],

  "wiper blade": [
    "wiper",
    "wiper blade",
    "wiper blades"
  ],

  "radiator": [
    "radiator",
    "engine radiator"
  ],

  "radiator cap": [
    "radiator cap",
    "coolant cap"
  ],

  "spark plug": [
    "spark plug",
    "spark plugs",
    "plug",
    "plugs"
  ],

  "bumper": [
    "bumper",
    "front bumper",
    "rear bumper"
  ],

  "bonnet": [
    "bonnet",
    "hood",
    "engine hood"
  ],

  "horn": [
    "horn",
    "car horn",
    "denso horn"
  ],

  "floor mat": [
    "floor mat",
    "floor mats",
    "car mat",
    "car mats"
  ],

  "sun shade": [
    "sun shade",
    "sunshade",
    "window shade",
    "sun visor shade"
  ]

};

/*
Find part from tokens
*/

export function detectPart(tokens) {

  for (const part in PART_SYNONYMS) {

    const synonyms = PART_SYNONYMS[part];

    for (const token of tokens) {

      if (synonyms.includes(token)) {
        return part;
      }

    }

  }

  return null;

}

/*
Self-learning for new parts
*/

export function learnPart(partName, synonym) {

  if (!partName || !synonym) return;

  partName = partName.toLowerCase();
  synonym = synonym.toLowerCase();

  if (!PART_SYNONYMS[partName]) {
    PART_SYNONYMS[partName] = [];
  }

  if (!PART_SYNONYMS[partName].includes(synonym)) {
    PART_SYNONYMS[partName].push(synonym);
  }

}

/*
Return known parts list
*/

export function listKnownParts() {
  return Object.keys(PART_SYNONYMS);
}
