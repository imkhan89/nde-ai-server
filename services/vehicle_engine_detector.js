import { VEHICLE_ENGINE_DATABASE } from "../data/vehicle_engine_database.js";

export function detectEngine(vehicle) {

    if (!vehicle || !vehicle.make || !vehicle.model || !vehicle.year) {
        return null;
    }

    const key = `${vehicle.make}_${vehicle.model}_${vehicle.year}`.toLowerCase();

    if (VEHICLE_ENGINE_DATABASE[key]) {
        return VEHICLE_ENGINE_DATABASE[key];
    }

    return null;

}
