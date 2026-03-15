const BRANDS = [
  "denso",
  "bosch",
  "ngk",
  "nwb",
  "toyota genuine",
  "honda genuine",
  "suzuki genuine",
  "kia genuine",
  "hyundai genuine"
];

function normalize(text = "") {
  return text.toLowerCase();
}

export function detectBrand(query = "") {
  const q = normalize(query);

  for (const brand of BRANDS) {
    if (q.includes(brand)) {
      return brand;
    }
  }

  return null;
}

export function getAllBrands() {
  return BRANDS;
}

export default {
  detectBrand,
  getAllBrands
};
