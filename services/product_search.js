import { semanticProductSearch } from "./semantic_product_search.js";
import { rankProducts } from "./product_ranker.js";

function normalizeQuery(query) {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function removeYearTokens(tokens) {
  return tokens.filter(t => !/^(19|20)\d{2}$/.test(t));
}

function removeShortTokens(tokens) {
  return tokens.filter(t => t.length > 2);
}

function tokenize(query) {
  return normalizeQuery(query).split(" ");
}

function buildQuery(tokens) {
  return tokens.join(" ");
}

export function searchProducts(query, limit = 10) {

  try {

    const tokens = tokenize(query);
    const cleanTokens = removeShortTokens(tokens);
    const withoutYears = removeYearTokens(cleanTokens);

    let results = [];

    /*
    Attempt 1: full query
    */
    results = semanticProductSearch(buildQuery(cleanTokens), limit);

    /*
    Attempt 2: remove year
    */
    if (results.length === 0 && withoutYears.length > 0) {
      results = semanticProductSearch(buildQuery(withoutYears), limit);
    }

    /*
    Attempt 3: product keyword only (last token)
    */
    if (results.length === 0 && withoutYears.length > 0) {
      const lastToken = withoutYears[withoutYears.length - 1];
      results = semanticProductSearch(lastToken, limit);
    }

    if (results.length === 0) {
      return [];
    }

    const ranked = rankProducts(results, query);

    return ranked.slice(0, limit);

  } catch (error) {

    console.error("Product search error:", error.message);

    return [];
  }
}
