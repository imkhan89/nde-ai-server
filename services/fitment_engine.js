import { VEHICLE_FITMENT_DATA } from "../data/vehicle_fitment_data.js";
import { VEHICLE_GENERATION_RANGES } from "../data/vehicle_generation_ranges.js";

export function getVehicleGeneration(make, model, year) {

    const key = `${make}_${model}`.toLowerCase();

    const ranges = VEHICLE_GENERATION_RANGES[key];

    if (!ranges) return null;

    for (const range of ranges) {

        if (year >= range.start && year <= range.end) {

            return `${make}_${model}_${range.start}_${range.end}`.toLowerCase();

        }

    }

    return null;

}

export function getFitmentData(make, model, year) {

    const generationKey = getVehicleGeneration(make, model, year);

    if (!generationKey) return null;

    const fitment = VEHICLE_FITMENT_DATA[generationKey];

    if (!fitment) return null;

    return fitment;

}
