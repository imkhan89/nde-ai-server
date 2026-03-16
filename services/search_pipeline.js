import { detectVehicle } from "../vehicle/vehicle_extractor.js";

export async function searchProducts(query) {

    if (!query) {
        return [];
    }

    const vehicle = detectVehicle(query);

    const text = query.toLowerCase();

    const catalog = [
        {
            title: "Honda Civic Air Filter",
            price: 3950,
            handle: "honda-civic-air-filter",
            vehicles: ["civic"]
        },
        {
            title: "Toyota Corolla Air Filter",
            price: 3650,
            handle: "toyota-corolla-air-filter",
            vehicles: ["corolla"]
        },
        {
            title: "Honda City Air Filter",
            price: 3450,
            handle: "honda-city-air-filter",
            vehicles: ["city"]
        },
        {
            title: "Toyota Corolla Spark Plug Set",
            price: 7200,
            handle: "toyota-corolla-spark-plug-set",
            vehicles: ["corolla"]
        },
        {
            title: "Honda Civic Wiper Blade Set",
            price: 2800,
            handle: "honda-civic-wiper-blades",
            vehicles: ["civic"]
        }
    ];

    if (vehicle) {

        const filtered = catalog.filter(product =>
            product.vehicles.includes(vehicle.model)
        );

        if (filtered.length > 0) {
            return filtered;
        }

    }

    const keywordMatch = catalog.filter(product =>
        product.title.toLowerCase().includes(text)
    );

    return keywordMatch;

}
