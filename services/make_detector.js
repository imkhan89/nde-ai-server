// services/make_detector.js

export function detectMake(query) {

    if (!query || typeof query !== "string") {
        return null;
    }

    const makes = [
        "toyota",
        "honda",
        "suzuki",
        "hyundai",
        "kia",
        "mitsubishi",
        "nissan",
        "daihatsu"
    ];

    const normalized = query.toLowerCase();

    for (const make of makes) {

        if (normalized.includes(make)) {
            return capitalize(make);
        }

    }

    return null;

}

function capitalize(text) {

    if (!text) return text;

    return text.charAt(0).toUpperCase() + text.slice(1);

}
