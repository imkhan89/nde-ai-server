import { parseQuery, scoreQueryIntent } from "./query_parser.js";
import { matchProducts, rankProducts } from "./product_matcher.js";
import { learnFromQuery } from "../database/auto_optimizer.js";

/*
NDE Automotive AI
Search Engine Core
Handles query → parsing → matching → ranking → learning
*/

export async function searchProducts(query) {

  if (!query) {
    return {
      query: "",
      intentScore: 0,
      results: []
    };
  }

  try {

    const parsed = parseQuery(query);

    const intentScore = scoreQueryIntent(parsed);

    const matchedProducts = await matchProducts(parsed);

    const rankedProducts = rankProducts(matchedProducts, parsed);

    await learnFromQuery(query, rankedProducts.slice(0, 5));

    return {
      query,
      parsed,
      intentScore,
      results: rankedProducts
    };

  } catch (error) {

    console.error("Search Engine Error:", error);

    return {
      query,
      intentScore: 0,
      results: []
    };

  }

}
