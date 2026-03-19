const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// ✅ FIXED PATH (NO ROOT ERROR)
const DATA_FILE = path.join(process.cwd(), "fitment_database.csv");

let database = [];

// ==============================
// NORMALIZE
// ==============================

function normalizeText(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ==============================
// LOAD DATABASE (FIXED)
// ==============================

function loadDatabase() {
  return new Promise((resolve, reject) => {
    database = [];

    console.log("📂 Loading DB from:", DATA_FILE);

    fs.createReadStream(DATA_FILE)
      .pipe(csv())
      .on("data", (row) => {
        const record = {
          part: normalizeText(row.part),
          make: normalizeText(row.make),
          model: normalizeText(row.model),
          year_start: parseInt(row.year_start) || 0,
          year_end: parseInt(row.year_end) || 9999,
          url: row.url,
          title: row.title
        };

        // ✅ FILTER INVALID ROWS
        if (!record.make || !record.model) return;

        database.push(record);
      })
      .on("end", () => {
        console.log("✅ DB Loaded:", database.length);
        resolve();
      })
      .on("error", (err) => {
        console.error("❌ DB LOAD ERROR:", err);
        reject(err);
      });
  });
}

// ==============================
// SEARCH ENGINE (FIXED)
// ==============================

function searchFitment({ part, make, model, year }) {
  const qPart = normalizeText(part);
  const qMake = normalizeText(make);
  const qModel = normalizeText(model);
  const qYear = parseInt(year);

  let results = database.filter((item) =>
    item.make === qMake &&
    item.model === qModel &&
    item.part.includes(qPart) &&
    (!qYear ||
      (qYear >= item.year_start && qYear <= item.year_end))
  );

  // ✅ FALLBACK (CRITICAL FIX)
  if (results.length === 0) {
    results = database.filter((item) =>
      item.part.includes(qPart)
    );
  }

  return results.slice(0, 5);
}

// ==============================
// RESPONSE FORMAT
// ==============================

function formatResponse(results, vehicle, part) {
  if (!results.length) {
    return `❌ No results found\n\n${vehicle}\n${part}`;
  }

  let msg = `🚗 ${vehicle}\n🔧 ${part}\n\n`;

  results.forEach((r, i) => {
    msg += `${i + 1}. ${r.title}\n${r.url}\n\n`;
  });

  return msg;
}

// ==============================

module.exports = {
  loadDatabase,
  searchFitment,
  formatResponse
};
