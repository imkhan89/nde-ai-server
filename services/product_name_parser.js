// services/product_name_parser.js

import { PRODUCT_SYNONYMS } from "../data/product_synonyms.js";

export function detectProductName(query) {

    if (!query || typeof query !== "string") {
        return null;
    }

    const normalized = query.toLowerCase();

    for (const productKey in PRODUCT_SYNONYMS) {

        const synonyms = PRODUCT_SYNONYMS[productKey];

        for (const synonym of synonyms) {

            if (normalized.includes(synonym)) {
                return formatProductName(productKey);
            }

        }

    }

    return null;
}

function formatProductName(productKey) {

    const productMap = {

        wiper: "Wiper Blade",
        brake: "Brake Pad",
        air_filter: "Air Filter",
        cabin_filter: "Cabin Filter",
        oil_filter: "Oil Filter",
        spark_plug: "Spark Plug",
        horn: "Car Horn",
        coolant: "Radiator Coolant",
        radiator: "Radiator",
        bumper: "Bumper",
        bonnet: "Bonnet Hood",
        mirror: "Side Mirror",
        headlight: "Headlight",
        taillight: "Tail Light"

    };

    return productMap[productKey] || productKey;
}
