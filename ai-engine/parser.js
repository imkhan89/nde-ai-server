const { normalizeText } = require("../fitmentService");

// ==============================
// YEAR
// ==============================
function extractYear(text) {
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0]) : null;
}

// ==============================
// MAKE
// ==============================
function detectMake(text) {
  const makes = ["honda","toyota","suzuki","daihatsu","nissan","kia","hyundai"];

  const t = normalizeText(text);

  return makes.find(m => t.includes(m)) || null;
}

// ==============================
// MODEL
// ==============================
function detectModel(text) {
  const models = [
    "civic","city","corolla","yaris","vitz",
    "alto","cultus","wagon r","mira"
  ];

  const t = normalizeText(text);

  return models.find(m => t.includes(m)) || null;
}

// ==============================
// PART
// ==============================
function detectPart(text) {
  return normalizeText(text);
}

// ==============================
// MAIN PARSER
// ==============================
function parseUserInput(text) {

  const make = detectMake(text);
  const model = detectModel(text);
  const year = extractYear(text);

  return {
    vehicle: { make, model, year },
    parts: [{
      raw: detectPart(text)
    }]
  };
}

module.exports = {
  parseUserInput
};
