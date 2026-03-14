import { semanticProductSearch } from "./semantic_product_search.js";

export async function productSearch(db, query) {

    try {

        if (!query || query.trim() === "") {
            return [];
        }

        const results = await semanticProductSearch(db, query);

        return results;

    } catch (error) {

        console.error("Product search error:", error);
        return [];

    }

}
