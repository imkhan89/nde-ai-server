const MAKES = [
  "toyota",
  "honda",
  "suzuki",
  "nissan",
  "mitsubishi",
  "kia",
  "hyundai",
  "daihatsu"
];

const MODELS = [
  "corolla",
  "yaris",
  "vitz",
  "civic",
  "city",
  "alto",
  "cultus",
  "wagonr",
  "mehran",
  "swift",
  "sportage",
  "elantra"
];

function detectMake(text = "") {
  const lower = text.toLowerCase();

  for (const make of MAKES) {
    if (lower.includes(make)) {
      return make;
    }
  }

  return null;
}

function detectModel(text = "") {
  const lower = text.toLowerCase();

  for (const model of MODELS) {
    if (lower.includes(model)) {
      return model;
    }
  }

  return null;
}

function detectYear(text = "") {
  const match = text.match(/\b(19|20)\d{2}\b/);
  if (match) {
    return parseInt(match[0]);
  }
  return null;
}

export function detectVehicle(text = "") {
  return {
    make: detectMake(text),
    model: detectModel(text),
    year: detectYear(text)
  };
}

export default {
  detectVehicle
};
