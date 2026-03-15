import { readSearchLogs } from "./search_logger.js";

/*
NDE Automotive AI
Analytics Engine

Analyzes search behavior to discover:
- Popular vehicles
- Popular parts
- Popular brands
- Zero-result searches

This helps AI automatically improve search relevance.
*/

export function analyzeSearchTrends(limit = 1000) {

  const logs = readSearchLogs(limit);

  const vehicles = {};
  const parts = {};
  const brands = {};
  const zeroResults = [];

  for (const log of logs) {

    if (!log) continue;

    const vehicleKey = log.vehicle
      ? `${log.vehicle.make || ""}_${log.vehicle.model || ""}`
      : null;

    if (vehicleKey) {

      vehicles[vehicleKey] = (vehicles[vehicleKey] || 0) + 1;

    }

    if (log.part) {

      parts[log.part] = (parts[log.part] || 0) + 1;

    }

    if (log.brand) {

      brands[log.brand] = (brands[log.brand] || 0) + 1;

    }

    if (log.results === 0) {

      zeroResults.push(log.query);

    }

  }

  return {
    popularVehicles: sortObject(vehicles),
    popularParts: sortObject(parts),
    popularBrands: sortObject(brands),
    zeroResultQueries: zeroResults.slice(0, 50)
  };

}

/*
Utility function to sort analytics
*/

function sortObject(obj) {

  return Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      key,
      count: value
    }));

}
