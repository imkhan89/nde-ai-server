// services/ai_engine.js

import { queryNormalizer } from "./query_normalizer.js";
import { parseVehicle } from "./vehicle_parser.js";
import { detectProductName } from "./product_name_parser.js";
import { getFitmentData } from "./fitment_engine.js";
import { productSearch } from "./product_search.js";

export async function processCustomerMessage(db, message) {

    try {

        if (!message || typeof message !== "string") {
            return "Sorry, I could not understand your message. Please send the vehicle and part required.";
        }

        // STEP 1 — Normalize user query
        const normalizedQuery = queryNormalizer(message);

        // STEP 2 — Detect vehicle information
        const vehicle = parseVehicle(normalizedQuery);

        // STEP 3 — Detect product name
        const product = detectProductName(normalizedQuery);

        // STEP 4 — Get vehicle fitment data if possible
        let fitment = null;

        if (vehicle && vehicle.make && vehicle.model && vehicle.year) {
            fitment = getFitmentData(vehicle.make, vehicle.model, vehicle.year);
        }

        // STEP 5 — Build search query
        let searchQuery = normalizedQuery;

        if (vehicle && product) {
            searchQuery = `${vehicle.model} ${product}`;
        } else if (product) {
            searchQuery = product;
        }

        // STEP 6 — Search products
        const products = await productSearch(db, searchQuery);

        // STEP 7 — Build WhatsApp response
        let response = "";

        if (vehicle && vehicle.make && vehicle.model) {

            response += "Vehicle Identification\n";
            response += `Make: ${vehicle.make}\n`;
            response += `Model: ${vehicle.model}\n`;

            if (vehicle.year) {
                response += `Year: ${vehicle.year}\n`;
            }

            response += "\n";

        }

        if (product) {

            response += "Product Requested\n";
            response += `${product}\n\n`;

        }

        if (fitment && fitment.wiper) {

            response += "Correct Wiper Specification\n";
            response += `Driver: ${fitment.wiper.driver}\n`;
            response += `Passenger: ${fitment.wiper.passenger}\n\n`;

        }

        if (products && products.length > 0) {

            response += "Available Products\n\n";

            products.slice(0, 5).forEach((product, index) => {

                response += `${index + 1}. ${product.title}\n`;

            });

        } else {

            response += "No matching products found. Please send vehicle details and part required.";

        }

        return response;

    } catch (error) {

        console.error("AI Engine Error:", error);

        return "Sorry, something went wrong while processing your request.";

    }

}
