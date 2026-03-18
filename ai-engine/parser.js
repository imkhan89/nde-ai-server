// ai-engine/parser.js

// -----------------------------
// 🧠 VEHICLE DATA
// -----------------------------
const MAKES = ["suzuki", "toyota", "honda", "daihatsu", "nissan"];

const MODELS = {
  suzuki: ["swift", "alto", "cultus", "wagonr"],
  toyota: ["corolla", "yaris", "prius", "fortuner"],
  honda: ["civic", "city", "brv"],
  daihatsu: ["mira", "move"],
  nissan: ["dayz"]
};

// -----------------------------
// 🔍 TOKENIZER
// -----------------------------
function tokenize(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9,\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

// -----------------------------
// 🚗 EXTRACT VEHICLE
// -----------------------------
function extractVehicle(userInput) {
  const tokens = tokenize(userInput);

  let make = null;
  let model = null;
  let year = null;

  tokens.forEach(token => {
    if (/^(19|20)\d{2}$/.test(token)) year = token;
    if (MAKES.includes(token)) make = token;
  });

  if (make && MODELS[make]) {
    tokens.forEach(token => {
      if (MODELS[make].includes(token)) model = token;
    });
  } else {
    Object.values(MODELS).forEach(list => {
      tokens.forEach(token => {
        if (list.includes(token)) model = token;
      });
    });
  }

  return { make, model, year };
}

// -----------------------------
// 📦 MULTI-PART DETECTION
// -----------------------------
function extractParts(userInput) {
  // split by comma or "and"
  const parts = userInput
    .toLowerCase()
    .split(/,| and /)
    .map(p => p.trim())
    .filter(Boolean);

  return parts;
}

// -----------------------------
// 📍 POSITION DETECTION
// -----------------------------
function detectPosition(text) {
  text = text.toLowerCase();

  let position = [];

  if (text.includes("front")) position.push("front");
  if (text.includes("rear")) position.push("rear");
  if (text.includes("left")) position.push("left");
  if (text.includes("right")) position.push("right");
  if (text.includes("upper")) position.push("upper");
  if (text.includes("lower")) position.push("lower");

  return position.length ? position.join("_") : null;
}

// -----------------------------
// 🧠 MASTER PARSER
// -----------------------------
function parseUserInput(userInput) {
  const vehicle = extractVehicle(userInput);

  const rawParts = extractParts(userInput);

  const parts = rawParts.map(p => {
    return {
      raw: p,
      position: detectPosition(p)
    };
  });

  return {
    vehicle,
    parts
  };
}

// -----------------------------
// 📤 EXPORT
// -----------------------------
module.exports = {
  parseUserInput
};
