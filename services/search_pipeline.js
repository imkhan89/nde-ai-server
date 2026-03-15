import { parseQuery, scoreQueryIntent } from "./query_parser.js";
import { expandQuery } from "./smart_query_expander.js";
import { matchProducts, rankProducts } from "./product_matcher.js";
import { getCachedSearch, setCachedSearch } from "./search_cache.js";
import { learnFromQuery } from "../database/auto_optimizer.js";

/*
NDE Automotive AI
Search Pipeline

Full pipeline:
Query → Cache → Parse → Expand → Match → Rank → Learn
*/

export async function runSearchPipeline(query) {

  if (!query) {
    return {
      query: "",
      results: []
    };
  }

  const cached = getCachedSearch(query);

  if (cached) {
    return cached;
  }

  const parsed = parseQuery(query);

  const intentScore = scoreQueryIntent(parsed);

  const expandedTokens = expandQuery(parsed);

  const matched = await matchProducts({
    ...parsed,
    tokens: expandedTokens
  });

  const ranked = rankProducts(matched, parsed);

  const response = {
    query,
    parsed,
    expandedTokens,
    intentScore,
    results: ranked
  };

  setCachedSearch(query, response);

  await learnFromQuery(query, ranked.slice(0, 5));

  return response;

}
