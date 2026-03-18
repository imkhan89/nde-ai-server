// ai-engine/parser.js

// -----------------------------
// 🧠 VEHICLE DATA (EXTENDABLE)
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
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

// -----------------------------
// 🚗 EXTRACT VEHICLE INFO
// -----------------------------
function extractVehicle(userInput) {
  const tokens = tokenize(userInput);

  let make = null;
  let model = null;
  let year = null;

  // Detect year (4 digit)
  tokens.forEach(token => {
    if (/^(19|20)\d{2}$/.test(token)) {
      year = token;
    }
  });

  // Detect make
  tokens.forEach(token => {
    if (MAKES.includes(token)) {
      make = token;
    }
  });

  // Detect model (based on make if available)
  if (make && MODELS[make]) {
    tokens.forEach(token => {
      if (MODELS[make].includes(token)) {
        model = token;
      }
    });
  } else {
    // fallback: scan all models
    Object.values(MODELS).forEach(modelList => {
      tokens.forEach(token => {
        if (modelList.includes(token)) {
          model = token;
        }
      });
    });
  }

  return {
    make,
    model,
    year
  };
}

// -----------------------------
// 📤 EXPORT
// -----------------------------
module.exports = {
  extractVehicle
};
