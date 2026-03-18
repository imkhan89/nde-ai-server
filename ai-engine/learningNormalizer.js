// ai-engine/learningNormalizer.js

// -----------------------------
// ✅ STRONG SYNONYMS (HIGH CONFIDENCE)
// -----------------------------
const STRONG_SYNONYMS = {
  brake_pads: [
    "brake pad",
    "brake pads",
    "disc pad",
    "disc pads",
    "break pad",
    "brake lining"
  ],
  air_filter: [
    "air filter",
    "engine filter",
    "air cleaner",
    "intake filter"
  ],
  cabin_filter: [
    "ac filter",
    "cabin filter",
    "aircon filter"
  ],
  oil_filter: [
    "oil filter",
    "engine oil filter"
  ]
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
// 📊 BASIC SCORING (FALLBACK)
// -----------------------------
const PART_KEYWORDS = {
  brake_pads: ["brake", "pad"],
  air_filter: ["air", "filter", "intake"],
  cabin_filter: ["ac", "cabin", "aircon"],
  oil_filter: ["oil", "engine"]
};

// -----------------------------
// 🧠 NORMALIZER
// -----------------------------
function normalizePart(userInput) {
  const text = userInput.toLowerCase();

  // -----------------------------
  // ✅ STRONG SYNONYM MATCH (DIRECT)
  // -----------------------------
  for (let part in STRONG_SYNONYMS) {
    for (let keyword of STRONG_SYNONYMS[part]) {
      if (text.includes(keyword)) {
        return {
          normalized_part: part,
          confidence: 95
        };
      }
    }
  }

  // -----------------------------
  // 🔄 FALLBACK SCORING
  // -----------------------------
  const tokens = tokenize(text);

  let bestMatch = "unknown";
  let bestScore = 0;

  Object.keys(PART_KEYWORDS).forEach(part => {
    let score = 0;

    PART_KEYWORDS[part].forEach(keyword => {
      if (tokens.includes(keyword)) {
        score += 20;
      }
    });

    if (score > bestScore) {
      bestScore = score;
      bestMatch = part;
    }
  });

  return {
    normalized_part: bestMatch,
    confidence: bestScore
  };
}

module.exports = {
  normalizePart
};
