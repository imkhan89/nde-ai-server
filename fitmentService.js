const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

let database = [];

function loadDatabase() {
    return new Promise((resolve, reject) => {

        const filePath = path.join(__dirname, "fitment_database.csv");

        database = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                database.push({
                    part: (row.part || "").toLowerCase(),
                    make: (row.make || "").toLowerCase(),
                    model: (row.model || "").toLowerCase(),
                    year_start: parseInt(row.year_start) || 0,
                    year_end: parseInt(row.year_end) || 9999,
                    url: row.url,
                    title: row.title
                });
            })
            .on("end", () => {
                console.log("✅ Fitment DB Loaded:", database.length);
                resolve();
            })
            .on("error", reject);
    });
}

const PART_MAP = {
    "air filter": ["air filter", "engine air filter"],
    "oil filter": ["oil filter"],
    "brake pad": ["brake pad", "brake pads"],
    "radiator": ["radiator"],
    "shock absorber": ["shock absorber", "shock"]
};

function normalizePart(input) {
    input = input.toLowerCase();

    for (let key in PART_MAP) {
        for (let variant of PART_MAP[key]) {
            if (input.includes(variant)) {
                return key;
            }
        }
    }

    return input;
}

function searchFitment({ part, make, model, year }) {

    part = normalizePart(part);
    make = make.toLowerCase();
    model = model.toLowerCase();

    let results = database.filter(item =>
        item.make === make &&
        item.model === model &&
        item.part === part &&
        year >= item.year_start &&
        year <= item.year_end
    );

    results = results.sort((a, b) =>
        (a.year_end - a.year_start) - (b.year_end - b.year_start)
    );

    return results.slice(0, 3);
}

function formatResponse(results, vehicle, part) {

    if (!results.length) {
        return `❌ No results found for ${vehicle} (${part})`;
    }

    let message = `🚗 Vehicle: ${vehicle}\n🔧 Part: ${part}\n\n✅ Compatible Options:\n\n`;

    results.forEach((item, index) => {
        message += `${index + 1}. ${item.title}\n${item.url}\n\n`;
    });

    message += "💬 Reply with option number to order";

    return message;
}

module.exports = {
    loadDatabase,
    searchFitment,
    formatResponse
};
