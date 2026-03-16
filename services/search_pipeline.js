import axios from "axios";
import { detectVehicle } from "../vehicle/vehicle_extractor.js";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const SHOPIFY_VERSION = process.env.SHOPIFY_API_VERSION || "2024-04";

export async function searchProducts(query) {

    if (!query) {
        return [];
    }

    const vehicle = detectVehicle(query);
    const q = query.toLowerCase();

    try {

        const url =
`https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_VERSION}/products.json?limit=50`;

        const response = await axios.get(url,{
            headers:{
                "X-Shopify-Access-Token": SHOPIFY_TOKEN,
                "Content-Type":"application/json"
            }
        });

        const products = response.data.products || [];

        let results = [];

        for (const p of products) {

            const title = p.title.toLowerCase();

            if (title.includes(q)) {

                results.push({
                    title: p.title,
                    price: p.variants?.[0]?.price || "",
                    handle: p.handle
                });

            }

        }

        if (results.length > 0) {
            return results.slice(0,3);
        }

        if (vehicle) {

            const filtered = products.filter(p =>
                p.title.toLowerCase().includes(vehicle.model)
            );

            results = filtered.map(p => ({
                title: p.title,
                price: p.variants?.[0]?.price || "",
                handle: p.handle
            }));

            return results.slice(0,3);

        }

        return [];

    } catch (error) {

        console.error("Shopify search error:", error.message);
        return [];

    }

}
