import { analyzeSearchTrends } from "./analytics_engine.js";

/*
NDE Automotive AI
Relevance Optimizer

Automatically improves search ranking
based on user behavior.
*/

let RELEVANCE_BOOST = {
  vehicles: {},
  parts: {},
  brands: {}
};

/*
Run optimizer
*/

export function optimizeRelevance() {

  const trends = analyzeSearchTrends(5000);

  updateVehicleBoost(trends.popularVehicles);

  updatePartBoost(trends.popularParts);

  updateBrandBoost(trends.popularBrands);

}

/*
Vehicle boost learning
*/

function updateVehicleBoost(list) {

  for (const item of list) {

    RELEVANCE_BOOST.vehicles[item.key] = item.count;

  }

}

/*
Part boost learning
*/

function updatePartBoost(list) {

  for (const item of list) {

    RELEVANCE_BOOST.parts[item.key] = item.count;

  }

}

/*
Brand boost learning
*/

function updateBrandBoost(list) {

  for (const item of list) {

    RELEVANCE_BOOST.brands[item.key] = item.count;

  }

}

/*
Apply relevance boost
*/

export function applyRelevanceBoost(product, parsedQuery, score) {

  let boostedScore = score;

  const vehicleKey = parsedQuery.vehicle
    ? `${parsedQuery.vehicle.make}_${parsedQuery.vehicle.model}`
    : null;

  if (vehicleKey && RELEVANCE_BOOST.vehicles[vehicleKey]) {

    boostedScore += Math.min(
      2,
      RELEVANCE_BOOST.vehicles[vehicleKey] * 0.01
    );

  }

  if (parsedQuery.part && RELEVANCE_BOOST.parts[parsedQuery.part]) {

    boostedScore += Math.min(
      2,
      RELEVANCE_BOOST.parts[parsedQuery.part] * 0.01
    );

  }

  if (parsedQuery.brand && RELEVANCE_BOOST.brands[parsedQuery.brand]) {

    boostedScore += Math.min(
      2,
      RELEVANCE_BOOST.brands[parsedQuery.brand] * 0.01
    );

  }

  return boostedScore;

}
