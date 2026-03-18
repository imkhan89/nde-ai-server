// ai-engine/parser.js

const vehicleDB = require("./vehicleDatabase.json");

// -----------------------------
// TOKENIZER
// -----------------------------
function tokenize(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

// -----------------------------
// VEHICLE DETECTION (SMART)
// -----------------------------
function extractVehicle(userInput) {
  const text = userInput.toLowerCase();
  const tokens = tokenize(text);

  let detectedMake = null;
  let detectedModel = null;
  let detectedYear = null;

  // -----------------------------
  // YEAR DETECTION
  // -----------------------------
  tokens.forEach(t => {
    if (/^(19|20)\d{2}$/.test(t)) {
      detectedYear = t;
    }
  });

  // -----------------------------
  // MAKE + MODEL DETECTION
  // -----------------------------
  for (let make in vehicleDB) {
    for (let model in vehicleDB[make]) {
      const variants = vehicleDB[make][model];

      for (let variant of variants) {
        if (text.includes(variant)) {
          detectedMake = make;
          detectedModel = model;
        }
      }
    }
  }

  return {
    make: detectedMake,
    model: detectedModel,
    year: detectedYear
  };
}

// -----------------------------
// MULTI PART SPLIT
// -----------------------------
function extractParts(userInput) {
  return userInput
    .toLowerCase()
    .split(/,| and /)
    .map(p => p.trim())
    .filter(Boolean);
}

// -----------------------------
// POSITION DETECTION
// -----------------------------
function detectPosition(text) {
  text = text.toLowerCase();

  let pos = [];

  if (text.includes("front")) pos.push("front");
  if (text.includes("rear")) pos.push("rear");
  if (text.includes("left")) pos.push("left");
  if (text.includes("right")) pos.push("right");

  return pos.length ? pos.join("_") : null;
}

// -----------------------------
// MASTER PARSER
// -----------------------------
function parseUserInput(userInput) {
  const vehicle = extractVehicle(userInput);

  const rawParts = extractParts(userInput);

  const parts = rawParts.map(p => ({
    raw: p,
    position: detectPosition(p)
  }));

  return {
    vehicle,
    parts
  };
}

module.exports = {
  parseUserInput
};
