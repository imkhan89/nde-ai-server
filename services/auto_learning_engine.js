import { analyzeSearchTrends } from "./analytics_engine.js";
import { learnPart } from "./parts_intelligence.js";
import { learnBrand } from "./brand_intelligence.js";
import { learnVehicle } from "./vehicle_intelligence.js";

/*
NDE Automotive AI
Auto Learning Engine

Analyzes search logs and automatically teaches the AI
new vehicles, parts, and brands discovered from user queries.
*/

export async function runAutoLearning() {

  const trends = analyzeSearchTrends(2000);

  learnVehicles(trends.popularVehicles);

  learnParts(trends.popularParts);

  learnBrands(trends.popularBrands);

}

/*
Learn vehicles automatically
*/

function learnVehicles(list) {

  for (const item of list) {

    const [make, model] = item.key.split("_");

    if (make && model) {

      learnVehicle(make, model);

    }

  }

}

/*
Learn parts automatically
*/

function learnParts(list) {

  for (const item of list) {

    const part = item.key;

    if (!part) continue;

    learnPart(part, part);

  }

}

/*
Learn brands automatically
*/

function learnBrands(list) {

  for (const item of list) {

    const brand = item.key;

    if (!brand) continue;

    learnBrand(brand, brand);

  }

}
