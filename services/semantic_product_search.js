// services/semantic_product_search.js

import { PRODUCT_SYNONYMS } from "../data/product_synonyms.js";

function expandQuery(query) {

    const tokens = query.toLowerCase().split(/\s+/);

    let expandedTokens = [];

    for (const token of tokens) {

        expandedTokens.push(token);

        for (const key in PRODUCT_SYNONYMS) {

            const synonyms = PRODUCT_SYNONYMS[key];

            if (synonyms.includes(token)) {
                expandedTokens = expandedTokens.concat(synonyms);
            }

        }

    }

    expandedTokens = [...new Set(expandedTokens)];

    return expandedTokens.join(" OR ");
}

export async function semanticProductSearch(db, query) {

    try {

        const expandedQuery = expandQuery(query);

        const results = await db.all(
            `
            SELECT
                rowid as id,
                title,
                handle
            FROM products_fts
            WHERE products_fts MATCH ?
            LIMIT 20
            `,
            [expandedQuery]
        );

        return results;

    } catch (error) {

        console.error("Semantic search error:", error);

        return [];

    }

}
