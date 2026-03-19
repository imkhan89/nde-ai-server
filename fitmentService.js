const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const DATA_FILE = path.join(__dirname, "fitment_database.csv");

let database = [];
let catalog = {
  makes: [],
  allModels: [],
  modelsByMake: {},
  parts: []
};

const NON_FITMENT_KEYWORDS = [
  "sticker",
  "decal",
  "monogram",
  "logo"
];

const PART_SYNONYMS = {
  "air filter": ["air filter", "engine air filter", "air cleaner"],
  "oil filter": ["oil filter"],
  "cabin filter": ["cabin filter", "ac filter", "a c filter", "air con filter"],
  "brake pad": ["brake pad", "brake pads", "disc pad", "disc pads", "pad set"],
  "brake shoe": ["brake shoe", "brake shoes"],
  "brake rotor": ["brake rotor", "brake disc", "disc rotor", "rotor"],
  "radiator": ["radiator"],
  "radiator cap": ["radiator cap"],
  "radiator bottle": ["radiator bottle", "reserve tank", "expansion tank"],
  "shock absorber": ["shock absorber", "shock", "absorber"],
  "stabilizer link": ["stabilizer link", "sway bar link"],
  "tie rod end": ["tie rod end", "tie rod"],
  "control arm": ["control arm", "arm assy", "arm assembly", "lower arm", "upper arm"],
  "ball joint": ["ball joint"],
  "wheel bearing": ["wheel bearing", "bearing"],
  "spark plug": ["spark plug"],
  "wiper blade": ["wiper blade", "wiper"],
  "clutch plate": ["clutch plate"],
  "clutch pressure plate": ["clutch pressure plate"],
  "clutch release bearing": ["clutch release bearing", "release bearing"],
  "fan shroud": ["fan shroud", "radiator fan shroud"],
  "temperature sensor": ["temperature sensor", "temp sensor", "coolant temperature sensor"],
  "oxygen sensor": ["oxygen sensor", "o2 sensor"],
  "fuel pump": ["fuel pump"],
  "horn": ["horn"],
  "headlight": ["headlight", "head lamp", "head lamp assembly"],
  "tail light": ["tail light", "rear light", "back light"],
  "fog lamp": ["fog lamp", "fog light"],
  "mirror glass": ["mirror glass", "side mirror glass"],
  "weather strip": ["weather strip", "door weather strip", "strip set"],
  "sun shade": ["sun shade", "sunshade"],
  "floor mat": ["floor mat", "car mat", "car floor mat"],
  "trunk mat": ["trunk mat", "boot mat"],
  "bumper": ["bumper", "front bumper", "rear bumper"],
  "fender shield": ["fender shield"],
  "engine shield": ["engine shield"],
  "engine mount": ["engine mount"],
  "monogram emblem": ["monogram", "emblem", "logo"]
};

function normalizeText(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isValidRow(row) {
  const part = normalizeText(row.part);
  const make = normalizeText(row.make);
  const model = normalizeText(row.model);
  const title = normalizeText(row.title);

  if (!part || !make || !model) return false;
  if (part === "unknown" || make === "unknown" || model === "unknown") return false;
  if (part === "nan" || make === "nan" || model === "nan") return false;

  const haystack = `${part} ${title}`;
  if (NON_FITMENT_KEYWORDS.some((k) => haystack.includes(k))) return false;

  return true;
}

function detectCanonicalPart(input) {
  const text = normalizeText(input);

  for (const [canonical, variants] of Object.entries(PART_SYNONYMS)) {
    for (const variant of variants) {
      const needle = normalizeText(variant);
      if (!needle) continue;
      const pattern = new RegExp(`\\b${escapeRegex(needle)}\\b`, "i");
      if (pattern.test(text) || text.includes(needle)) {
        return canonical;
      }
    }
  }

  return null;
}

function cleanPartText(input) {
  return normalizeText(input)
    .replace(/\b(19|20)\d{2}\b/g, " ")
    .replace(/\b(for|with|and|the|a|an|of|to|new|original|genuine|premium|high|quality|set|kit|assy|assembly|part|parts)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePart(input) {
  const canonical = detectCanonicalPart(input);
  if (canonical) return canonical;

  const cleaned = cleanPartText(input);
  return cleaned || normalizeText(input);
}

function buildCatalog() {
  const makeSet = new Set();
  const allModelSet = new Set();
  const modelsByMake = {};
  const partSet = new Set();

  for (const row of database) {
    const make = normalizeText(row.make);
    const model = normalizeText(row.model);
    const part = normalizeText(row.part);

    if (make && make !== "unknown") {
      makeSet.add(make);

      if (!modelsByMake[make]) modelsByMake[make] = new Set();
      if (model && model !== "unknown") {
        modelsByMake[make].add(model);
        allModelSet.add(model);
      }
    }

    if (part) partSet.add(part);
  }

  const modelsPlain = {};
  for (const [make, modelSet] of Object.entries(modelsByMake)) {
    modelsPlain[make] = [...modelSet].sort((a, b) => b.length - a.length);
  }

  catalog = {
    makes: [...makeSet].sort((a, b) => b.length - a.length),
    allModels: [...allModelSet].sort((a, b) => b.length - a.length),
    modelsByMake: modelsPlain,
    parts: [...partSet].sort((a, b) => b.length - a.length)
  };
}

function loadDatabase() {
  return new Promise((resolve, reject) => {
    database = [];

    fs.createReadStream(DATA_FILE)
      .pipe(csv())
      .on("data", (row) => {
        const record = {
          part: normalizeText(row.part || ""),
          make: normalizeText(row.make || ""),
          model: normalizeText(row.model || ""),
          year_start: Number.parseInt(row.year_start, 10),
          year_end: Number.parseInt(row.year_end, 10),
          url: String(row.url || "").trim(),
          title: String(row.title || "").trim()
        };

        if (!Number.isFinite(record.year_start)) record.year_start = 0;
        if (!Number.isFinite(record.year_end)) record.year_end = 9999;

        if (record.year_start > record.year_end) {
          const tmp = record.year_start;
          record.year_start = record.year_end;
          record.year_end = tmp;
        }

        if (isValidRow(record)) {
          database.push(record);
        }
      })
      .on("end", () => {
        buildCatalog();
        console.log(`✅ Fitment DB loaded: ${database.length} rows`);
        resolve(database.length);
      })
      .on("error", reject);
  });
}

function getDatabase() {
  return [...database];
}

function getCatalog() {
  return {
    makes: [...catalog.makes],
    allModels: [...catalog.allModels],
    modelsByMake: { ...catalog.modelsByMake },
    parts: [...catalog.parts]
  };
}

function scorePartMatch(dbPart, queryPart) {
  const db = normalizeText(dbPart);
  const q = normalizeText(queryPart);

  if (!db || !q) return 0;

  if (db === q) return 100;
  if (db.includes(q) || q.includes(db)) return 80;

  const dbTokens = new Set(db.split(" ").filter(Boolean));
  const qTokens = q.split(" ").filter(Boolean);

  if (!qTokens.length) return 0;

  const common = qTokens.filter((t) => dbTokens.has(t)).length;
  if (!common) return 0;

  return Math.round((common / qTokens.length) * 60);
}

function searchFitment({ part, make, model, year }) {
  const queryPart = normalizePart(part || "");
  const queryMake = normalizeText(make || "");
  const queryModel = normalizeText(model || "");
  const queryYear = Number.parseInt(year, 10);

  if (!queryPart) return [];

  let results = [];

  for (const item of database) {
    const itemMake = normalizeText(item.make);
    const itemModel = normalizeText(item.model);

    let score = 0;

    if (queryMake) {
      if (itemMake === queryMake) {
        score += 30;
      } else if (itemMake.includes(queryMake) || queryMake.includes(itemMake)) {
        score += 20;
      } else {
        continue;
      }
    }

    if (queryModel) {
      if (itemModel === queryModel) {
        score += 25;
      } else if (itemModel.includes(queryModel) || queryModel.includes(itemModel)) {
        score += 15;
      } else {
        continue;
      }
    }

    const partScore = scorePartMatch(item.part, queryPart);
    if (!partScore) continue;
    score += partScore;

    if (Number.isFinite(queryYear) && queryYear > 0) {
      if (queryYear >= item.year_start && queryYear <= item.year_end) {
        score += 20;
        const rangeSize = Math.max(0, item.year_end - item.year_start);
        score += Math.max(0, 10 - Math.min(10, rangeSize));
      } else {
        continue;
      }
    }

    results.push({
      ...item,
      score
    });
  }

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aRange = a.year_end - a.year_start;
    const bRange = b.year_end - b.year_start;
    return aRange - bRange;
  });

  return results.slice(0, 5).map(({ score, ...rest }) => rest);
}

function formatResponse(results, vehicleLabel, partLabel) {
  if (!results.length) {
    return (
      `No exact match found for:\n` +
      `${vehicleLabel}\n` +
      `${partLabel}\n\n` +
      `Please send: Part + Make + Model + Year\n` +
      `Example: Air Filter Honda Civic 2018`
    );
  }

  let message = `Vehicle: ${vehicleLabel}\n`;
  message += `Part: ${partLabel}\n\n`;
  message += `Compatible options:\n\n`;

  results.forEach((item, index) => {
    const title = item.title || `${item.part} ${item.make} ${item.model}`;
    message += `${index + 1}. ${title}\n`;
    message += `${item.url}\n\n`;
  });

  message += `Reply with the number to order.`;
  return message.trim();
}

module.exports = {
  loadDatabase,
  getDatabase,
  getCatalog,
  normalizeText,
  detectCanonicalPart,
  normalizePart,
  searchFitment,
  formatResponse
};
