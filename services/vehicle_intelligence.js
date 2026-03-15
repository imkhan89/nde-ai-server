/*
NDE AUTOMOTIVE AI
Vehicle Intelligence Engine
Learns vehicle make, model, and year from user queries
Auto-optimizing and self-learning
*/

const KNOWN_MAKES = [
  "toyota",
  "honda",
  "suzuki",
  "kia",
  "hyundai",
  "daihatsu",
  "nissan",
  "mitsubishi",
  "changan",
  "mg",
  "proton",
  "dfsk",
  "faw",
  "isuzu",
  "mazda"
];

const MODEL_MAP = {

  toyota: [
    "corolla",
    "yaris",
    "vitz",
    "prius",
    "fortuner",
    "hilux",
    "revo",
    "camry",
    "landcruiser"
  ],

  honda: [
    "civic",
    "city",
    "brv",
    "hrv",
    "vezel",
    "accord"
  ],

  suzuki: [
    "alto",
    "cultus",
    "swift",
    "wagonr",
    "mehran",
    "bolan",
    "carry",
    "jimny"
  ],

  kia: [
    "sportage",
    "picanto",
    "sorento",
    "stonic"
  ],

  hyundai: [
    "elantra",
    "tucson",
    "sonata",
    "santro",
    "accent"
  ],

  mg: [
    "hs",
    "zs"
  ],

  proton: [
    "saga"
  ]
};

/*
Extract vehicle year
*/

function extractYear(tokens) {

  for (const t of tokens) {

    const year = parseInt(t);

    if (year >= 1980 && year <= 2035) {
      return year.toString();
    }

  }

  return null;
}

/*
Extract make
*/

function extractMake(tokens) {

  for (const t of tokens) {

    if (KNOWN_MAKES.includes(t)) {
      return t;
    }

  }

  return null;
}

/*
Extract model
*/

function extractModel(make, tokens) {

  if (!make) return null;

  const models = MODEL_MAP[make];

  if (!models) return null;

  for (const t of tokens) {

    if (models.includes(t)) {
      return t;
    }

  }

  return null;
}

/*
Main vehicle detection
*/

export function detectVehicle(tokens) {

  const make = extractMake(tokens);

  const model = extractModel(make, tokens);

  const year = extractYear(tokens);

  return {
    make,
    model,
    year
  };

}

/*
AI self learning extension
Allows new vehicles to be added dynamically
*/

export function learnVehicle(make, model) {

  if (!make || !model) return;

  make = make.toLowerCase();
  model = model.toLowerCase();

  if (!KNOWN_MAKES.includes(make)) {
    KNOWN_MAKES.push(make);
  }

  if (!MODEL_MAP[make]) {
    MODEL_MAP[make] = [];
  }

  if (!MODEL_MAP[make].includes(model)) {
    MODEL_MAP[make].push(model);
  }

}
