const { normalizeText } = require("../fitmentService");

function extractYear(text) {
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? parseInt(match[0]) : null;
}

function detectMake(text) {
  const makes = ["honda","toyota","suzuki","daihatsu","nissan","kia","hyundai"];
  const t = normalizeText(text);

  return makes.find(m => t.includes(m)) || null;
}

function detectModel(text) {
  const models = [
    "civic","city","corolla","yaris","vitz",
    "alto","cultus","wagon r","mira"
  ];

  const t = normalizeText(text);
  return models.find(m => t.includes(m)) || null;
}

function detectPart(text) {
  return normalizeText(text);
}

function parseUserInput(text) {
  return {
    vehicle: {
      make: detectMake(text),
      model: detectModel(text),
      year: extractYear(text)
    },
    parts: [{
      raw: detectPart(text)
    }]
  };
}

module.exports = {
  parseUserInput
};
