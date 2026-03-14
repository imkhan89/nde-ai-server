// services/product_search.js

import { semanticProductSearch } from "./semantic_product_search.js";
import { rankProducts } from "./product_ranker.js";

export async function productSearch(db, query) {

    try {

        if (!query || typeof query !== "string") {
            return [];
        }

        const cleanedQuery = query.trim();

        if (cleanedQuery.length === 0) {
            return [];
        }

        // Step 1 — Semantic search (FTS)
        const results = await semanticProductSearch(db, cleanedQuery);

        if (!results || results.length === 0) {
            return [];
        }

        // Step 2 — Rank products for better recommendation
        const rankedProducts = rankProducts(results, cleanedQuery);

        return rankedProducts;

    } catch (error) {

        console.error("Product search error:", error);

        return [];

    }

}
