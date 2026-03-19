const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const DATA_FILE = path.join(__dirname, "../fitment_database.csv");

let database = [];

function normalizeText(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
          year_start: Number.isFinite(parseInt(row.year_start))
            ? parseInt(row.year_start)
            : 0,
          year_end: Number.isFinite(parseInt(row.year_end))
            ? parseInt(row.year_end)
            : 9999,
          url: row.url,
          title: row.title
        };

        if (!record.make || !record.model) return;

        database.push(record);
      })
      .on("end", () => {
        console.log("✅ DB Loaded:", database.length);
        resolve();
      })
      .on("error", reject);
  });
}

function normalizePart(part) {
  return normalizeText(part);
}

function searchFitment({ part, make, model, year }) {
  const queryPart = normalizePart(part);
  const queryMake = normalizeText(make);
  const queryModel = normalizeText(model);
  const queryYear = parseInt(year);

  let results = database.filter((item) =>
    item.make === queryMake &&
    item.model === queryModel &&
    item.part.includes(queryPart) &&
    (!queryYear ||
      (queryYear >= item.year_start && queryYear <= item.year_end))
  );

  // fallback if no results
  if (results.length === 0) {
    results = database.filter((item) =>
      item.part.includes(queryPart)
    );
  }

  return results.slice(0, 5);
}

function formatResponse(results, vehicle, part) {
  if (!results.length) {
    return `No results found for ${vehicle} (${part})`;
  }

  let msg = `Vehicle: ${vehicle}\nPart: ${part}\n\n`;

  results.forEach((r, i) => {
    msg += `${i + 1}. ${r.title}\n${r.url}\n\n`;
  });

  return msg;
}

module.exports = {
  loadDatabase,
  searchFitment,
  formatResponse
};
