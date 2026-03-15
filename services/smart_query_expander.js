/*
NDE Automotive AI
Smart Query Expander

Expands user search queries using the knowledge graph
to improve search results.
*/

import { getVehicleParts } from "./knowledge_graph.js";

export function expandQuery(parsedQuery) {

  const expanded = new Set(parsedQuery.tokens || []);

  const { vehicle, part } = parsedQuery;

  if (vehicle?.make && vehicle?.model) {

    const relatedParts = getVehicleParts(vehicle.make, vehicle.model);

    for (const p of relatedParts) {

      if (part && p.includes(part)) {
        expanded.add(p);
      }

    }

  }

  if (part) {

    expanded.add(part);

    const synonyms = getPartSynonyms(part);

    for (const s of synonyms) {
      expanded.add(s);
    }

  }

  return Array.from(expanded);

}

/*
Basic part synonym expansion
*/

function getPartSynonyms(part) {

  const SYNONYMS = {
    "brake pad": ["brake pads", "brakepad"],
    "brake rotor": ["brake disc", "disc rotor"],
    "air filter": ["engine air filter", "air cleaner"],
    "oil filter": ["engine oil filter"],
    "cabin filter": ["ac filter", "cabin ac filter"],
    "wiper blade": ["wiper", "wipers"],
    "radiator": ["engine radiator"],
    "spark plug": ["spark plugs", "plug"]
  };

  return SYNONYMS[part] || [];

}
