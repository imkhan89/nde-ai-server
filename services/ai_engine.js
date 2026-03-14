// services/ai_engine.js

import { queryNormalizer } from "./query_normalizer.js";
import { parseVehicle } from "./vehicle_parser.js";
import { detectProductName } from "./product_name_parser.js";
import { getFitmentData } from "./fitment_engine.js";
import { productSearch } from "./product_search.js";

function detectIntent(message) {

    const text = message.toLowerCase();

    const intent = {
        price: false,
        availability: false,
        technical: false,
        installation: false
    };

    const priceWords = ["price", "cost", "rate", "how much"];
    const stockWords = ["available", "availability", "in stock", "have"];
    const technicalWords = [
        "size",
        "inch",
        "mm",
        "weight",
        "spec",
        "specification",
        "dimension"
    ];
    const installWords = [
        "install",
        "installation",
        "how to install",
        "how to use",
        "fit",
        "fitting"
    ];

    for (const w of priceWords) {
        if (text.includes(w)) intent.price = true;
    }

    for (const w of stockWords) {
        if (text.includes(w)) intent.availability = true;
    }

    for (const w of technicalWords) {
        if (text.includes(w)) intent.technical = true;
    }

    for (const w of installWords) {
        if (text.includes(w)) intent.installation = true;
    }

    return intent;
}

function buildSalesMessage(vehicle, product, products) {

    let response = "";

    if (vehicle && vehicle.make && vehicle.model) {

        response += `Vehicle detected:\n`;
        response += `${vehicle.make} ${vehicle.model}`;

        if (vehicle.year) {
            response += ` ${vehicle.year}`;
        }

        response += `\n\n`;
    }

    if (product) {

        response += `Product requested:\n`;
        response += `${product}\n\n`;
    }

    if (products && products.length > 0) {

        response += `Available options at ndestore.com:\n\n`;

        products.slice(0, 5).forEach((p, index) => {
            response += `${index + 1}. ${p.title}\n`;
        });

        response += `\n`;
        response += `These products are available for nationwide delivery.\n`;
        response += `Please let us know your preferred brand or budget and we will assist you further.\n`;

    } else {

        response += `Please provide the vehicle make, model, year and required part so we can assist you.\n`;
        response += `Example:\nToyota Corolla 2018 brake pads\n`;
    }

    return response;
}

function buildTechnicalMessage(intent, fitment, product) {

    let response = "";

    if (intent.technical && fitment) {

        if (product && product.toLowerCase().includes("wiper") && fitment.wiper) {

            response += `Technical specification:\n`;
            response += `Driver side: ${fitment.wiper.driver}\n`;
            response += `Passenger side: ${fitment.wiper.passenger}\n\n`;
        }
    }

    if (intent.installation) {

        response += `Installation guidance:\n`;
        response += `Ensure the vehicle ignition is off before replacing the component.\n`;
        response += `Remove the old part carefully and install the new component following the original mounting points.\n`;
        response += `If unsure, professional installation is recommended.\n\n`;
    }

    return response;
}

export async function processCustomerMessage(db, message) {

    try {

        if (!message || typeof message !== "string") {
            return "Please send vehicle details and the required part.";
        }

        const normalizedQuery = queryNormalizer(message);

        const vehicle = parseVehicle(normalizedQuery);

        const product = detectProductName(normalizedQuery);

        const intent = detectIntent(message);

        let fitment = null;

        if (vehicle && vehicle.make && vehicle.model && vehicle.year) {
            fitment = getFitmentData(vehicle.make, vehicle.model, vehicle.year);
        }

        let searchQuery = normalizedQuery;

        if (vehicle && product) {
            searchQuery = `${vehicle.model} ${product}`;
        } else if (product) {
            searchQuery = product;
        }

        const products = await productSearch(db, searchQuery);

        let response = "";

        response += buildSalesMessage(vehicle, product, products);

        response += buildTechnicalMessage(intent, fitment, product);

        return response;

    } catch (error) {

        console.error("AI Engine Error:", error);

        return "Sorry, something went wrong. Please send vehicle details and required part.";

    }
}
