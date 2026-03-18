// ai-engine/learningNormalizer.js

const fs = require("fs");
const path = require("path");

// -----------------------------
// 📦 DATA STORAGE (LEARNING)
// -----------------------------
const LEARNING_FILE = path.join(__dirname, "../data/learning.json");

// Load learning data
function loadLearningData() {
  try {
    if (!fs.existsSync(LEARNING_FILE)) {
      return {};
    }
    const data = fs.readFileSync(LEARNING_FILE);
    return JSON.parse(data);
  } catch (err) {
    console.error("Learning data load error:", err);
    return {};
  }
}

// Save learning data
function saveLearningData(data) {
  try {
    fs.writeFileSync(LEARNING_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Learning data save error:", err);
  }
}

// -----------------------------
// 🧩 CANONICAL PART DEFINITIONS
// -----------------------------
const PART_DEFINITIONS = {
  air_filter: {
    keywords: ["air", "intake", "cleaner", "element"],
    negative: ["oil", "brake", "cabin"]
  },
  oil_filter: {
    keywords: ["oil", "engine"],
    negative: ["air", "cabin"]
  },
  cabin_filter: {
    keywords: ["cabin", "ac", "aircon", "filter"],
    negative: ["engine"]
  },
  brake_pads: {
    keywords: ["brake", "pad", "pads"],
    negative: []
  }
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
// 📊 SCORING ENGINE
// -----------------------------
function scorePart(tokens, partKey, learningData) {
  const part = PART_DEFINITIONS[partKey];
  let score = 0;

  // Keyword matching
  tokens.forEach(token => {
    if (part.keywords.includes(token)) {
      score += 20;
    }

    // Negative keywords
    if (part.negative.includes(token)) {
      score -= 15;
    }
  });

  // Learned phrases boost
  if (learningData[partKey]) {
    learningData[partKey].forEach(phrase => {
      const phraseTokens = tokenize(phrase);
      const matchCount = phraseTokens.filter(t => tokens.includes(t)).length;

      if (matchCount >= 2) {
        score += 25;
      }
    });
  }

  return score;
}

// -----------------------------
// 🧠 MAIN NORMALIZER FUNCTION
// -----------------------------
function normalizePart(userInput) {
  const tokens = tokenize(userInput);
  const learningData = loadLearningData();

  let bestMatch = null;
  let highestScore = -Infinity;

  Object.keys(PART_DEFINITIONS).forEach(partKey => {
    const score = scorePart(tokens, partKey, learningData);

    if (score > highestScore) {
      highestScore = score;
      bestMatch = partKey;
    }
  });

  // Confidence calculation
  let confidence = Math.min(100, Math.max(0, highestScore));

  return {
    raw_input: userInput,
    tokens,
    normalized_part: bestMatch,
    confidence
  };
}

// -----------------------------
// 📈 LEARNING FUNCTION
// -----------------------------
function learnFromQuery(userInput, normalizedPart) {
  const learningData = loadLearningData();

  if (!learningData[normalizedPart]) {
    learningData[normalizedPart] = [];
  }

  // Avoid duplicates
  if (!learningData[normalizedPart].includes(userInput)) {
    learningData[normalizedPart].push(userInput);
  }

  saveLearningData(learningData);
}

// -----------------------------
// 📤 EXPORTS
// -----------------------------
module.exports = {
  normalizePart,
  learnFromQuery
};
