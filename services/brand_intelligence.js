/*
NDE Automotive AI
Brand Intelligence Engine
Detects automotive brands and learns new ones automatically
*/

const BRAND_SYNONYMS = {

  denso: [
    "denso"
  ],

  bosch: [
    "bosch"
  ],

  ngk: [
    "ngk"
  ],

  nwb: [
    "nwb"
  ],

  toyota: [
    "toyota",
    "genuine toyota"
  ],

  honda: [
    "honda",
    "genuine honda"
  ],

  suzuki: [
    "suzuki",
    "genuine suzuki"
  ]

};

/*
Detect brand from tokens
*/

export function detectBrand(tokens) {

  for (const brand in BRAND_SYNONYMS) {

    const synonyms = BRAND_SYNONYMS[brand];

    for (const token of tokens) {

      if (synonyms.includes(token)) {
        return brand;
      }

    }

  }

  return null;

}

/*
Self-learning brand system
*/

export function learnBrand(brandName, synonym) {

  if (!brandName || !synonym) return;

  brandName = brandName.toLowerCase();
  synonym = synonym.toLowerCase();

  if (!BRAND_SYNONYMS[brandName]) {
    BRAND_SYNONYMS[brandName] = [];
  }

  if (!BRAND_SYNONYMS[brandName].includes(synonym)) {
    BRAND_SYNONYMS[brandName].push(synonym);
  }

}

/*
Return known brands
*/

export function listKnownBrands() {

  return Object.keys(BRAND_SYNONYMS);

}
