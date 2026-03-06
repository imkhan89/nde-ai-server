const fuzzyMatchPart = require("./fuzzy_parts_engine");

/* ======================================================
AUTOMOTIVE QUERY PARSER
Converts messy customer queries into structured search
====================================================== */

const MAKES = [
  "toyota",
  "honda",
  "suzuki",
  "kia",
  "hyundai",
  "haval",
  "changan"
];

const MODELS = {
  toyota: ["corolla","yaris","hilux"],
  honda: ["civic","city","brv"],
  suzuki: ["alto","cultus","swift","wagon r"],
  kia: ["sportage","picanto"],
  hyundai: ["elantra","tucson"],
  haval: ["h6","jolion"]
};

const PARTS = [
  "air filter",
  "oil filter",
  "cabin filter",
  "brake pad",
  "spark plug",
  "radiator coolant",
  "wiper blade"
];

/* ======================================================
NORMALIZATION
====================================================== */

const SYNONYMS = {
  "break pad": "brake pad",
  "brakepads": "brake pad",
  "pads": "brake pad",
  "airfilter": "air filter",
  "oilfilter": "oil filter"
};

function normalizeQuery(query){

  query = query.toLowerCase();

  Object.keys(SYNONYMS).forEach(word=>{
    query = query.replace(word,SYNONYMS[word]);
  });

  return query;

}

/* ======================================================
DETECTION
====================================================== */

function detectMake(query){

  for(const make of MAKES){
    if(query.includes(make)) return make;
  }

  return null;

}

function detectModel(query,make){

  if(!make) return null;

  const models = MODELS[make] || [];

  for(const model of models){
    if(query.includes(model)) return model;
  }

  return null;

}

function detectPart(query){

  for(const part of PARTS){
    if(query.includes(part)) return part;
  }

  return null;

}

function detectYear(query){

  const match = query.match(/\b(19|20)\d{2}\b/);

  return match ? match[0] : null;

}

/* ======================================================
MAIN PARSER
====================================================== */

function parseQuery(query){

  query = normalizeQuery(query);

  const make = detectMake(query);
  const model = detectModel(query,make);
  const part = detectPart(query);
  const year = detectYear(query);

  return {
    make,
    model,
    part,
    year
  };

}

module.exports = parseQuery;
