// services/ai_engine.js

import { queryNormalizer } from "./query_normalizer.js";
import { parseVehicle } from "./vehicle_parser.js";
import { detectProductName } from "./product_name_parser.js";
import { getFitmentData } from "./fitment_engine.js";
import { productSearch } from "./product_search.js";
import { detectIntent } from "./intent_detector.js";
import {
    buildGreetingResponse,
    buildRecommendationResponse,
    buildPriceResponse,
    buildAvailabilityResponse,
    buildTechnicalResponse
} from "./sales_response_builder.js";

import {
    getSession,
    updateVehicle,
    updateProduct,
    updateSearchResults,
    updateLastQuery
} from "./conversation_memory.js";

export async function processCustomerMessage(db, sessionId, message) {

    try {

        if (!message || typeof message !== "string") {
            return "Please send vehicle details and the required part.";
        }

        const normalizedQuery = queryNormalizer(message);

        const intent = detectIntent(message);

        const session = getSession(sessionId);

        const detectedVehicle = parseVehicle(normalizedQuery);

        const detectedProduct = detectProductName(normalizedQuery);

        let vehicle = detectedVehicle || session.vehicle;
        let product = detectedProduct || session.product;

        if (detectedVehicle) updateVehicle(sessionId, detectedVehicle);
        if (detectedProduct) updateProduct(sessionId, detectedProduct);

        if (intent.greeting && !vehicle && !product) {
            return buildGreetingResponse();
        }

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

        updateSearchResults(sessionId, products);
        updateLastQuery(sessionId, searchQuery);

        if (intent.price) {
            return buildPriceResponse(products);
        }

        if (intent.availability) {
            return buildAvailabilityResponse(products);
        }

        let response = "";

        response += buildRecommendationResponse(vehicle, product, products);

        response += buildTechnicalResponse(intent, fitment, product);

        return response;

    } catch (error) {

        console.error("AI engine error:", error);

        return "Sorry, something went wrong. Please send vehicle details and required part.";

    }

}
