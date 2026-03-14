// services/vehicle_parser.js

import { detectMake } from "./make_detector.js";
import { detectYear } from "./year_parser.js";
import { VEHICLE_GENERATION_RANGES } from "../data/vehicle_generation_ranges.js";

export function parseVehicle(query) {

    if (!query || typeof query !== "string") {
        return null;
    }

    const make = detectMake(query);
    const year = detectYear(query);
    const model = detectModel(query, make);

    if (!make || !model) {
        return null;
    }

    let generation = null;

    if (year) {
        generation = detectGeneration(make, model, year);
    }

    return {
        make,
        model,
        year,
        generation
    };
}

function detectModel(query, make) {

    const modelsByMake = {

        toyota: [
            "corolla",
            "vios",
            "yaris",
            "hilux",
            "revo",
            "fortuner",
            "prado",
            "land cruiser"
        ],

        honda: [
            "civic",
            "city",
            "brv",
            "accord"
        ],

        suzuki: [
            "cultus",
            "swift",
            "alto",
            "wagonr",
            "mehran",
            "bolan"
        ],

        hyundai: [
            "santro",
            "elantra",
            "tucson",
            "sonata"
        ],

        kia: [
            "sportage",
            "picanto",
            "stonic"
        ]

    };

    const models = modelsByMake[make?.toLowerCase()];

    if (!models) return null;

    for (const model of models) {

        if (query.includes(model)) {
            return capitalize(model);
        }

    }

    return null;
}

function detectGeneration(make, model, year) {

    const key = `${make}_${model}`.toLowerCase();

    const ranges = VEHICLE_GENERATION_RANGES[key];

    if (!ranges) return null;

    for (const range of ranges) {

        if (year >= range.start && year <= range.end) {
            return `${range.start}-${range.end}`;
        }

    }

    return null;
}

function capitalize(text) {

    if (!text) return text;

    return text.charAt(0).toUpperCase() + text.slice(1);
}
