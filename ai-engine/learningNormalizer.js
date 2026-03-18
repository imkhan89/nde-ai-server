// ai-engine/learningNormalizer.js

const fs = require("fs");
const path = require("path");

const LEARNING_FILE = path.join(__dirname, "../data/learning.json");

// -----------------------------
// CORE PART DEFINITIONS (LOCKED)
// -----------------------------
const CORE_PARTS = {
  brake_pads: ["brake pad", "disc pad", "brake pads"],
  air_filter: ["air filter", "engine filter", "air cleaner"],
  cabin_filter: ["ac filter", "cabin filter"],
  oil_filter: ["oil filter"]
};

// -----------------------------
// LOAD / SAVE LEARNING
// -----------------------------
function loadLearning() {
  try {
    if (!fs.existsSync(LEARNING_FILE)) return {};
    return JSON.parse(fs.readFileSync(LEARNING_FILE));
  } catch {
    return {};
  }
}

function saveLearning(data) {
  fs.writeFileSync(LEARNING_FILE, JSON.stringify(data, null, 2));
}

// -----------------------------
// NORMALIZER (CONTROLLED)
// -----------------------------
function normalizePart(userInput) {
  const text = userInput.toLowerCase();

  // ✅ STEP 1: CORE MATCH (NO DOUBT)
  for (let part in CORE_PARTS) {
    for (let keyword of CORE_PARTS[part]) {
      if (text.includes(keyword)) {
        return {
          normalized_part: part,
          confidence: 95,
          source: "core"
        };
      }
    }
  }

  // ✅ STEP 2: LEARNING MATCH
  const learning = loadLearning();

  for (let part in learning) {
    for (let phrase of learning[part]) {
      if (text.includes(phrase)) {
        return {
          normalized_part: part,
          confidence: 85,
          source: "learned"
        };
      }
    }
  }

  // ❌ UNKNOWN (NO AUTO LEARNING HERE)
  return {
    normalized_part: "unknown",
    confidence: 40,
    source: "unknown"
  };
}

// -----------------------------
// SAFE LEARNING
// -----------------------------
function learnSynonym(userInput, correctPart) {
  if (correctPart === "unknown") return; // ❌ NEVER LEARN UNKNOWN

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
