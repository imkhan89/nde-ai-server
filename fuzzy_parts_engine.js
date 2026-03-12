const Fuse = require("./fuse");
const fs = require("fs");
const path = require("path");

const partsPath = path.join(__dirname, "data", "parts_dictionary.json");

let parts = [];

try {
  parts = JSON.parse(fs.readFileSync(partsPath, "utf8"));
} catch (error) {
  console.error("Parts dictionary load error:", error);
  parts = [];
}

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function expandPartsDictionary(list) {

  const expanded = [];

  for (const item of list) {

    if (typeof item === "string") {
      expanded.push({ name: item });
      continue;
    }

    expanded.push(item);

    if (item.aliases && Array.isArray(item.aliases)) {

      for (const alias of item.aliases) {

        expanded.push({
          ...item,
          name: alias
        });

      }

    }

  }

  return expanded;

}

const expandedParts = expandPartsDictionary(parts);

let fuse = null;

try {

  fuse = new Fuse(expandedParts, {
    includeScore: true,
    threshold: 0.32,
    keys: ["name", "part", "keyword", "keywords", "alias", "aliases"]
  });

} catch (error) {

  console.error("Fuse initialization failed:", error);

}

function fuzzyMatchPart(query) {

  if (!query || typeof query !== "string") {
    return null;
  }

  if (!fuse) {
    return null;
  }

  const cleanQuery = normalize(query);

  const results = fuse.search(cleanQuery);

  if (!results || !results.length) {
    return null;
  }

  return results[0].item;

}

module.exports = fuzzyMatchPart;
