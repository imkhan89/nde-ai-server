/*
NDE Automotive AI
Compatibility Engine

Determines if a product fits a requested vehicle
and allows the AI to learn compatibility rules.
*/

const COMPATIBILITY_RULES = [];

/*
Add compatibility rule
Example:
Toyota Corolla 2014–2019 brake pads fit 2014,2015,2016,2017,2018,2019
*/

export function addCompatibilityRule(rule) {

  if (!rule) return;

  COMPATIBILITY_RULES.push({
    make: rule.make || null,
    model: rule.model || null,
    startYear: rule.startYear || null,
    endYear: rule.endYear || null,
    part: rule.part || null
  });

}

/*
Check if product matches vehicle query
*/

export function isCompatible(product, vehicle, part) {

  if (!product) return false;

  let score = 0;

  if (vehicle.make && product.vehicle_make === vehicle.make) {
    score += 3;
  }

  if (vehicle.model && product.vehicle_model === vehicle.model) {
    score += 3;
  }

  if (vehicle.year && product.vehicle_year === vehicle.year) {
    score += 2;
  }

  if (part && product.category && product.category.includes(part)) {
    score += 2;
  }

  return score >= 4;

}

/*
Rule-based compatibility check
*/

export function checkCompatibilityRules(vehicle, part) {

  const matches = [];

  for (const rule of COMPATIBILITY_RULES) {

    if (vehicle.make && rule.make && vehicle.make !== rule.make) {
      continue;
    }

    if (vehicle.model && rule.model && vehicle.model !== rule.model) {
      continue;
    }

    if (vehicle.year && rule.startYear && rule.endYear) {

      const y = parseInt(vehicle.year);

      if (y < rule.startYear || y > rule.endYear) {
        continue;
      }

    }

    if (part && rule.part && part !== rule.part) {
      continue;
    }

    matches.push(rule);

  }

  return matches;

}

/*
Self-learning compatibility
*/

export function learnCompatibility(product) {

  if (!product) return;

  const rule = {
    make: product.vehicle_make || null,
    model: product.vehicle_model || null,
    startYear: product.vehicle_year || null,
    endYear: product.vehicle_year || null,
    part: product.category || null
  };

  addCompatibilityRule(rule);

}
