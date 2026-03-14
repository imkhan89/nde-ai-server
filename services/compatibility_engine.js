import { PART_COMPATIBILITY_RULES } from "../data/part_compatibility_rules.js";

export function checkCompatibility(vehicle, productType) {

    if (!vehicle || !productType) {
        return false;
    }

    const rule = PART_COMPATIBILITY_RULES[productType.toLowerCase()];

    if (!rule) {
        return true;
    }

    return true;

}
