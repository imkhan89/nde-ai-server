// services/product_ranker.js

export function rankProducts(products, query) {

    if (!products || products.length === 0) {
        return [];
    }

    const q = query.toLowerCase();

    const scored = products.map(product => {

        let score = 0;

        const title = product.title.toLowerCase();

        // Strong match
        if (title.includes(q)) {
            score += 50;
        }

        // Brand preference scoring
        if (title.includes("denso")) score += 30;
        if (title.includes("bosch")) score += 25;
        if (title.includes("ngk")) score += 25;
        if (title.includes("nwb")) score += 20;

        // OEM keywords
        if (title.includes("genuine")) score += 15;
        if (title.includes("oem")) score += 10;

        // Popular auto parts terms
        if (title.includes("premium")) score += 5;

        return {
            ...product,
            score
        };

    });

    scored.sort((a, b) => b.score - a.score);

    return scored;

}
