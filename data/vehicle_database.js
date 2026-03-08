/* =====================================================
NDE AUTOMOTIVE VEHICLE DATABASE
Auto-generated from vehicle_list.txt
===================================================== */

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "vehicle_list.txt");

let vehicles = [];

try {

/* =====================================================
LOAD RAW DATASET
===================================================== */

const raw = fs.readFileSync(filePath, "utf8")
.split("\n")
.map(v => v.trim())
.filter(v => v.length > 0);

/* =====================================================
PROCESS VEHICLES
===================================================== */

let currentMake = "";

raw.forEach(line => {

line = line.trim();

if (!line) return;

/* -----------------------------------------------------
DETECT VEHICLE MAKE
Example:
TOYOTA
HONDA
SUZUKI
----------------------------------------------------- */

if (line === line.toUpperCase() && !line.includes("(") && line.length < 30) {

currentMake = line
.replace(/[^A-Z0-9\s]/g, "")
.trim();

return;
}

/* -----------------------------------------------------
DETECT YEAR RANGE
Example:
TOYOTA COROLLA (2002-2008)
----------------------------------------------------- */

const yearMatch = line.match(/\((\d{4})-(\d{4}|ONWARD|ONWARDS)\)/i);

if (yearMatch) {

let yearStart = parseInt(yearMatch[1]);
let yearEnd = yearMatch[2];

if (yearEnd === "ONWARD" || yearEnd === "ONWARDS") {
yearEnd = 2026;
}

yearEnd = parseInt(yearEnd);

/* Extract Model */

let model = line
.replace(/\(.+\)/, "")
.replace(currentMake, "")
.trim();

if (!model) return;

vehicles.push({
make: currentMake,
model: model,
year_start: yearStart,
year_end: yearEnd,
show_year_menu: true
});

}

/* -----------------------------------------------------
MODEL WITHOUT YEAR
Example:
TOYOTA RAIZE
----------------------------------------------------- */

else {

if (!currentMake) return;

if (line.toUpperCase().includes(currentMake)) {

let model = line
.replace(currentMake, "")
.trim();

if (!model) return;

vehicles.push({
make: currentMake,
model: model,
year_start: 2000,
year_end: 2026,
show_year_menu: false
});

}

}

});

} catch (err) {

console.error("Vehicle dataset load error:", err.message);

vehicles = [];

}

/* =====================================================
EXPORT
===================================================== */

module.exports = {
vehicles
};
