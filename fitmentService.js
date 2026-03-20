const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const DATA_FILE = path.join(process.cwd(), "fitment_database.csv");

let database = [];

// ==============================
function normalizeText(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ==============================
// LOAD
// ==============================
function loadDatabase() {
  return new Promise((resolve, reject) => {
    database = [];

    fs.createReadStream(DATA_FILE)
      .pipe(csv())
      .on("data", (row) => {
        database.push({
          part: normalizeText(row.part),
          make: normalizeText(row.make),
          model: normalizeText(row.model),
          year_start: parseInt(row.year_start) || 0,
          year_end: parseInt(row.year_end) || 9999,
          url: row.url,
          title: row.title
        });
      })
      .on("end", () => {
        console.log("✅ DB Loaded:", database.length);
        resolve();
      })
      .on("error", reject);
  });
}

// ==============================
// SMART MATCH (FIXED)
// ==============================
function searchFitment({ part, make, model, year }) {

  const qPart = normalizeText(part);
  const qMake = normalizeText(make);
  const qModel = normalizeText(model);
  const qYear = parseInt(year);

  let results = database.filter(item =>
    item.make.includes(qMake) &&
    item.model.includes(qModel) &&
    item.part.includes(qPart) &&
    (!qYear || (qYear >= item.year_start && qYear <= item.year_end))
  );

  // 🔥 fallback without year
  if (results.length === 0) {
    results = database.filter(item =>
      item.make.includes(qMake) &&
      item.model.includes(qModel) &&
      item.part.includes(qPart)
    );
  }

  // 🔥 fallback part only
  if (results.length === 0) {
    results = database.filter(item =>
      item.part.includes(qPart)
    );
  }

  return results.slice(0, 3);
}

// ==============================
function formatResponse(results, vehicle, part) {

  if (!results.length) {
    return (
      "No exact match found.\n\n" +
      "Try:\nAir Filter Honda Civic 2018\n\n" +
      "Reply # to return to Main Menu."
    );
  }

  let msg = `${vehicle}\n${part}\n\n`;

  msg += "Available Options:\n\n";

  results.forEach((r, i) => {
    msg += `${i + 1}. ${r.title}\n${r.url}\n\n`;
  });

  msg += "Reply with option number to order\n";
  msg += "Reply # to return to Main Menu.";

  return msg;
}

// ==============================
module.exports = {
  loadDatabase,
  searchFitment,
  formatResponse,
  normalizeText
};
