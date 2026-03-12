const Fuse = require("./fuse");
const fs = require("fs");
const path = require("path");

const parts = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "data", "parts_dictionary.json"),
    "utf8"
  )
);

const options = {
  includeScore: true,
  threshold: 0.35,
  keys: ["name", "part", "keyword", "keywords"]
};

const fuse = new Fuse(parts, options);

function fuzzyMatchPart(query) {

  if (!query || typeof query !== "string") {
    return null;
  }

  const result = fuse.search(query);

  if (!result || !result.length) {
    return null;
  }

  return result[0].item;
}

module.exports = fuzzyMatchPart;
