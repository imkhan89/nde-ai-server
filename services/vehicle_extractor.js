/*
NDE Automotive AI
Vehicle Extraction Engine

Extracts vehicle make, model, and year directly from
Shopify product titles automatically.

Example:
"Toyota Corolla 2014-2019 Brake Pads"
*/

const MAKES = [
  "toyota",
  "honda",
  "suzuki",
  "kia",
  "hyundai",
  "nissan",
  "daihatsu",
  "mitsubishi",
  "mazda",
  "changan",
  "mg",
  "proton",
  "dfsk",
  "faw",
  "isuzu"
];

export function extractVehicleFromTitle(title) {

  if (!title) {
    return {
      make: null,
      model: null,
      year: null
    };
  }

  const text = title.toLowerCase();

  const tokens = text.split(/\s+/);

  let make = null;
  let model = null;
  let year = null;

  for (const token of tokens) {

    if (!make && MAKES.includes(token)) {
      make = token;
      continue;
    }

    if (!year) {

      const match = token.match(/\d{4}/);

      if (match) {
        const y = parseInt(match[0]);

        if (y >= 1980 && y <= 2035) {
          year = match[0];
        }
      }

    }

  }

  /*
  Model detection
  */

  if (make) {

    const index = tokens.indexOf(make);

    if (index !== -1 && tokens[index + 1]) {
      model = tokens[index + 1];
    }

  }

  return {
    make,
    model,
    year
  };

}
