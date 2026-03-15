const WMI_MANUFACTURERS = {
  JT: "toyota",
  JH: "honda",
  JS: "suzuki",
  KM: "hyundai",
  KN: "kia",
  JN: "nissan",
  JA: "mitsubishi",
  ML: "daihatsu"
};

const MODEL_YEAR_CODES = {
  A: 2010,
  B: 2011,
  C: 2012,
  D: 2013,
  E: 2014,
  F: 2015,
  G: 2016,
  H: 2017,
  J: 2018,
  K: 2019,
  L: 2020,
  M: 2021,
  N: 2022,
  P: 2023,
  R: 2024,
  S: 2025,
  T: 2026
};

function decodeManufacturer(vin) {
  const prefix = vin.substring(0, 2).toUpperCase();
  return WMI_MANUFACTURERS[prefix] || null;
}

function decodeYear(vin) {
  const yearCode = vin.charAt(9).toUpperCase();
  return MODEL_YEAR_CODES[yearCode] || null;
}

export function decodeVIN(vin = "") {
  if (!vin || vin.length !== 17) {
    return null;
  }

  const manufacturer = decodeManufacturer(vin);
  const year = decodeYear(vin);

  return {
    vin,
    manufacturer,
    year
  };
}

export default {
  decodeVIN
};
