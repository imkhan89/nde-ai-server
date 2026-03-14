// services/product_search.js

import { semanticProductSearch } from "./semantic_product_search.js";

export async function productSearch(db, query) {

    try {

        if (!query || typeof query !== "string") {
            return [];
        }

        const cleanedQuery = query.trim();

        if (cleanedQuery.length === 0) {
            return [];
        }

        const results = await semanticProductSearch(db, cleanedQuery);

        return results;

    } catch (error) {

        console.error("Product search error:", error);

        return [];

    }

}
