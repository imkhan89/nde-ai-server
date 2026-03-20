const { normalizeText } = require("../fitmentService");

// ==============================
// YEAR
// ==============================
function extractYear(text) {
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0]) : null;
}

// ==============================
// MAKE LIST
// ==============================
const MAKES = [
  "honda","toyota","suzuki","daihatsu",
  "nissan","kia","hyundai"
];

// ==============================
// MODEL MAP (CRITICAL FIX)
// ==============================
const MODELS = {
  honda: ["civic","city","brv","hrv"],
  toyota: ["corolla","yaris","vitz","revo"],
  suzuki: ["swift","alto","cultus","wagon r"],
  daihatsu: ["mira","move"],
  nissan: [],
  kia: [],
  hyundai: []
};

// ==============================
// DETECT MAKE
// ==============================
function detectMake(text) {
  const t = normalizeText(text);
  return MAKES.find(m => t.includes(m)) || null;
}

// ==============================
// DETECT MODEL (FIXED)
// ==============================
function detectModel(text, make) {
  const t = normalizeText(text);

  if (!make) return null;

  const models = MODELS[make] || [];

  return models.find(m => t.includes(m)) || null;
}

// ==============================
// DETECT PART (IMPROVED)
// ==============================
function detectPart(text, make, model) {

  let t = normalizeText(text);

  // remove make + model + year
  if (make) t = t.replace(make, "");
  if (model) t = t.replace(model, "");

  t = t.replace(/\b(19|20)\d{2}\b/g, "");

  return t.trim();
}

// ==============================
// MAIN PARSER
// ==============================
function parseUserInput(text) {

  const make = detectMake(text);
  const model = detectModel(text, make);
  const year = extractYear(text);

  const part = detectPart(text, make, model);

  return {
    vehicle: { make, model, year },
    parts: [{
      raw: part || text
    }]
  };
}

module.exports = {
  parseUserInput
};
