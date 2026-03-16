export function detectVehicle(query) {

    if (!query) {
        return null;
    }

    const text = query.toLowerCase();

    const vehicles = [
        "civic",
        "corolla",
        "city",
        "yaris",
        "cultus",
        "alto",
        "swift",
        "sportage",
        "tucson",
        "elantra",
        "sonata",
        "fortuner",
        "revo",
        "hilux"
    ];

    for (const vehicle of vehicles) {

        if (text.includes(vehicle)) {

            return {
                model: vehicle
            };

        }

    }

    return null;

}
