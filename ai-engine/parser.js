const {
  getCatalog,
  normalizeText,
  detectCanonicalPart,
  normalizePart
} = require("../fitmentService");

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractYear(text) {
  const value = String(text || "");
  const rangeMatch = value.match(/\b((?:19|20)\d{2})\s*-\s*((?:19|20)\d{2})\b/);
  if (rangeMatch) {
    const start = Number.parseInt(rangeMatch[1], 10);
    const end = Number.parseInt(rangeMatch[2], 10);
    return Number.isFinite(start) ? start : null;
  }

  const singleMatch = value.match(/\b((?:19|20)\d{2})\b/);
  if (singleMatch) {
    const year = Number.parseInt(singleMatch[1], 10);
    return Number.isFinite(year) ? year : null;
  }

  return null;
}

function detectMake(text, catalog) {
  const haystack = normalizeText(text);
  const makes = [...(catalog.makes || [])].sort((a, b) => b.length - a.length);

  for (const make of makes) {
    const pattern = new RegExp(`\\b${escapeRegex(make)}\\b`, "i");
    if (pattern.test(haystack)) return make;
  }

  return null;
}

function detectModel(text, make, catalog) {
  const haystack = normalizeText(text);

  let models = [];
  if (make && catalog.modelsByMake && catalog.modelsByMake[make]) {
    models = catalog.modelsByMake[make];
  } else if (catalog.allModels) {
    models = catalog.allModels;
  }

  models = [...models].sort((a, b) => b.length - a.length);

  for (const model of models) {
    const pattern = new RegExp(`\\b${escapeRegex(model)}\\b`, "i");
    if (pattern.test(haystack)) return model;
  }

  return null;
}

function extractPartText(text, make, model) {
  let cleaned = normalizeText(text);

  cleaned = cleaned.replace(/\b((?:19|20)\d{2})\b/g, " ");

  if (make) {
    cleaned = cleaned.replace(new RegExp(`\\b${escapeRegex(make)}\\b`, "gi"), " ");
  }

  if (model) {
    cleaned = cleaned.replace(new RegExp(`\\b${escapeRegex(model)}\\b`, "gi"), " ");
  }

  cleaned = cleaned.replace(
    /\b(for|with|and|the|a|an|of|to|new|original|genuine|premium|high|quality|set|kit|assy|assembly|model|year|years)\b/g,
    " "
  );

  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned || null;
}

function detectPosition(text) {
  const haystack = normalizeText(text);
  const pos = [];

  if (haystack.includes("front")) pos.push("front");
  if (haystack.includes("rear")) pos.push("rear");
  if (haystack.includes("left")) pos.push("left");
  if (haystack.includes("right")) pos.push("right");

  return pos.length ? pos.join("_") : null;
}

function splitSegments(text) {
  const segments = String(text || "")
    .split(/,|\band\b|&/i)
    .map((s) => s.trim())
    .filter(Boolean);

  return segments.length ? segments : [String(text || "").trim()];
}

function parseUserInput(userInput) {
  const catalog = getCatalog();
  const rawText = String(userInput || "").trim();
  const normalizedText = normalizeText(rawText);

  const vehicle = {
    make: detectMake(normalizedText, catalog),
    model: null,
    year: extractYear(rawText)
  };

  vehicle.model = detectModel(normalizedText, vehicle.make, catalog);

  const segments = splitSegments(rawText);

  const parts = [];
  for (const segment of segments) {
    const canonicalPart = detectCanonicalPart(segment);
    const fallbackPart = extractPartText(segment, vehicle.make, vehicle.model);
    const partText = canonicalPart || fallbackPart || null;

    if (partText) {
      parts.push({
        raw: normalizePart(partText),
        position: detectPosition(segment)
      });
    }
  }

  return {
    rawText,
    vehicle,
    parts
  };
}

module.exports = {
  parseUserInput
};
