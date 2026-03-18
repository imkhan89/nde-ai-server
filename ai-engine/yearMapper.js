// ai-engine/yearMapper.js

// -----------------------------
// YEAR RANGE MAP (EXPANDABLE)
// -----------------------------
const YEAR_RANGES = [
  { from: 2016, to: 2021 },
  { from: 2017, to: 2021 },
  { from: 2012, to: 2016 },
  { from: 2008, to: 2012 }
];

// -----------------------------
// FIND MATCHING RANGE
// -----------------------------
function mapYearToRange(year) {
  if (!year) return null;

  year = parseInt(year);

  for (let range of YEAR_RANGES) {
    if (year >= range.from && year <= range.to) {
      return `${range.from}-${range.to}`;
    }
  }

  return year.toString(); // fallback
}

module.exports = {
  mapYearToRange
};
