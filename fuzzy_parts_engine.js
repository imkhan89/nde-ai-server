const Fuse = require("fuse.js");
const fs = require("fs");
const path = require("path");

const parts = JSON.parse(
  fs.readFileSync(path.join(__dirname,"data/parts_dictionary.json"))
);

const options = {
  includeScore: true,
  threshold: 0.35
};

const fuse = new Fuse(parts, options);

function fuzzyMatchPart(query){

  const result = fuse.search(query);

  if(!result.length) return null;

  return result[0].item;

}

module.exports = fuzzyMatchPart;
