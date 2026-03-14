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

        // Step 1 — Normalize the query
        const normalizedQuery = queryNormalizer(message);

        // Step 2 — Detect vehicle information
        const vehicle = parseVehicle(normalizedQuery);

        // Step 3 — Detect product name
        const product = detectProductName(normalizedQuery);

        // Step 4 — Retrieve fitment data
        let fitment = null;

        if (vehicle && vehicle.make && vehicle.model && vehicle.year) {
            fitment = getFitmentData(vehicle.make, vehicle.model, vehicle.year);
        }

        // Step 5 — Build search query
        let searchQuery = normalizedQuery;

        if (vehicle && product) {
            searchQuery = `${vehicle.model} ${product}`;
        } else if (product) {
            searchQuery = product;
        }

        // Step 6 — Search products
        const products = await productSearch(db, searchQuery);

        // Step 7 — Build response message
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
            response += `Product Requested\n${product}\n\n`;
        }

        if (fitment && fitment.wiper) {

            response += "Correct Wiper Specification\n";
            response += `Driver: ${fitment.wiper.driver}\n`;
            response += `Passenger: ${fitment.wiper.passenger}\n\n`;

        }

        if (products && products.length > 0) {

            response += "Available Products\n\n";

            products.slice(0, 5).forEach((p, index) => {

                response += `${index + 1}. ${p.title}\n`;

            });

        } else {

            response += "No matching products found. Please send vehicle details and part required.";

        }

        return response;

    } catch (error) {

        console.error("AI engine error:", error);

        return "Sorry, something went wrong while processing your request.";

    }

}
