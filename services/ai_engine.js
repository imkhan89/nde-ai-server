// services/ai_engine.js

import { queryNormalizer } from "./query_normalizer.js";
import { parseVehicle } from "./vehicle_parser.js";
import { detectProductName } from "./product_name_parser.js";
import { getFitmentData } from "./fitment_engine.js";
import { productSearch } from "./product_search.js";

function customerAskedTechnical(message) {

    const text = message.toLowerCase();

    const technicalWords = [
        "size",
        "length",
        "inch",
        "mm",
        "dimension",
        "spec",
        "specification",
        "weight"
    ];

    for (const word of technicalWords) {
        if (text.includes(word)) {
            return true;
        }
    }

    return false;

}

function buildSalesResponse(vehicle, product, products, fitment, originalMessage) {

    let response = "";

    const askedTechnical = customerAskedTechnical(originalMessage);

    if (vehicle && vehicle.make && vehicle.model) {

        response += `Thank you for your inquiry.\n\n`;
        response += `Vehicle detected:\n`;
        response += `${vehicle.make} ${vehicle.model}`;

        if (vehicle.year) {
            response += ` ${vehicle.year}`;
        }

        response += `\n\n`;

    }

    if (product) {

        response += `You are looking for:\n`;
        response += `${product}\n\n`;

    }

    if (products && products.length > 0) {

        response += `We have the following options available:\n\n`;

        products.slice(0, 5).forEach((p, index) => {

            response += `${index + 1}. ${p.title}\n`;

        });

        response += `\n`;

        response += `All products are available at ndestore.com and can be shipped nationwide.\n\n`;

        response += `Please let us know if you would like:\n`;
        response += `• Original brand\n`;
        response += `• OEM equivalent\n`;
        response += `• Budget option\n`;

        response += `\nWe will assist you with the best option for your vehicle.`;

    } else {

        response += `Thank you for your message.\n\n`;
        response += `To assist you better, please send:\n`;
        response += `• Vehicle make\n`;
        response += `• Model\n`;
        response += `• Year\n`;
        response += `• Required part\n`;

        response += `Example:\n`;
        response += `Toyota Corolla 2018 wiper blade`;

    }

    if (askedTechnical && fitment && fitment.wiper) {

        response += `\n\nTechnical specification:\n`;
        response += `Driver side: ${fitment.wiper.driver}\n`;
        response += `Passenger side: ${fitment.wiper.passenger}\n`;

    }

    return response;

}

export async function processCustomerMessage(db, message) {

    try {

        if (!message || typeof message !== "string") {
            return "Please send vehicle details and the part you require.";
        }

        const normalizedQuery = queryNormalizer(message);

        const vehicle = parseVehicle(normalizedQuery);

        const product = detectProductName(normalizedQuery);

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

        const response = buildSalesResponse(
            vehicle,
            product,
            products,
            fitment,
            message
        );

        return response;

    } catch (error) {

        console.error("AI engine error:", error);

        return "Sorry, something went wrong. Please send your vehicle details and required part.";

    }

}
