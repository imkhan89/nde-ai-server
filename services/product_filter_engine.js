export function filterProductsForVehicle(products, vehicle, productType) {

    if (!products) return [];

    return products.filter(product => {

        const title = product.title.toLowerCase();

        if (vehicle && vehicle.model) {

            if (title.includes(vehicle.model.toLowerCase())) {
                return true;
            }

        }

        return true;

    });

}
