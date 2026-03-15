/*
NDE Automotive AI
Health Monitor

Monitors internal AI services and reports their health status.
*/

import { getCacheStats } from "./search_cache.js";
import { getKnowledgeGraph } from "./knowledge_graph.js";

export function getSystemHealth() {

  try {

    const cache = getCacheStats();

    const graph = getKnowledgeGraph();

    const vehicleCount = Object.keys(graph.vehicles || {}).length;
    const partCount = Object.keys(graph.parts || {}).length;
    const brandCount = Object.keys(graph.brands || {}).length;

    return {
      status: "ok",
      cache,
      knowledge_graph: {
        vehicles: vehicleCount,
        parts: partCount,
        brands: brandCount,
        relations: graph.relations?.length || 0
      },
      uptime: process.uptime()
    };

  } catch (error) {

    return {
      status: "error",
      message: error.message
    };

  }

}
