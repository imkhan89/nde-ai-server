// services/product_ranker.js

export function rankProducts(products, query) {

    if (!products || products.length === 0) {
        return [];
    }

    const q = query.toLowerCase();

    const ranked = products.map(product => {

        let score = 0;

        const title = product.title.toLowerCase();

        // Exact phrase match
        if (title.includes(q)) {
            score += 50;
        }

        // Brand priority (helps sales + trusted brands)
        if (title.includes("denso")) score += 30;
        if (title.includes("bosch")) score += 25;
        if (title.includes("ngk")) score += 25;
        if (title.includes("nwb")) score += 20;

        // Quality indicators
        if (title.includes("genuine")) score += 15;
        if (title.includes("oem")) score += 10;
        if (title.includes("original")) score += 10;

        // Premium indicators
        if (title.includes("premium")) score += 5;

        return {
            ...product,
            score
        };

    });

    ranked.sort((a, b) => b.score - a.score);

    return ranked;
}
