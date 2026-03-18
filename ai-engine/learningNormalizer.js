// ai-engine/learningNormalizer.js

const fs = require("fs");
const path = require("path");

const LEARNING_FILE = path.join(__dirname, "../data/learning.json");

// -----------------------------
// LOAD / SAVE LEARNING
// -----------------------------
function loadLearning() {
  try {
    if (!fs.existsSync(LEARNING_FILE)) return {};
    return JSON.parse(fs.readFileSync(LEARNING_FILE));
  } catch (e) {
    return {};
  }
}

function saveLearning(data) {
  try {
    fs.writeFileSync(LEARNING_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Learning save error:", e.message);
  }
}

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
// BASE KNOWLEDGE (MINIMAL CORE)
// -----------------------------
const BASE_PARTS = {
  brake_pads: ["brake", "pad"],
  air_filter: ["air", "filter"],
  cabin_filter: ["ac", "cabin"],
  oil_filter: ["oil"]
};

// -----------------------------
// NORMALIZER (DYNAMIC LEARNING)
// -----------------------------
function normalizePart(userInput) {
  const text = userInput.toLowerCase();
  const tokens = tokenize(text);

  const learning = loadLearning();

  let bestMatch = null;
  let bestScore = 0;

  const allParts = new Set([
    ...Object.keys(BASE_PARTS),
    ...Object.keys(learning)
  ]);

  allParts.forEach(part => {
    let score = 0;

    // BASE KEYWORDS
    if (BASE_PARTS[part]) {
      BASE_PARTS[part].forEach(k => {
        if (tokens.includes(k)) score += 20;
      });
    }

    // LEARNED PHRASES (UNLIMITED)
    if (learning[part]) {
      learning[part].forEach(phrase => {
        if (text.includes(phrase)) {
          score += 80; // strong boost
        }
      });
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = part;
    }
  });

  return {
    normalized_part: bestMatch || "unknown",
    confidence: bestScore
  };
}

// -----------------------------
// LEARN FROM USER CORRECTION
// -----------------------------
function learnSynonym(userInput, correctPart) {
  const learning = loadLearning();

  if (!learning[correctPart]) {
    learning[correctPart] = [];
  }

  const text = userInput.toLowerCase();

  if (!learning[correctPart].includes(text)) {
    learning[correctPart].push(text);
  }

  saveLearning(learning);
}

module.exports = {
  normalizePart,
  learnSynonym
};
