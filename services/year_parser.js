// services/year_parser.js

export function detectYear(query) {

    if (!query || typeof query !== "string") {
        return null;
    }

    const yearMatch = query.match(/\b(19\d{2}|20\d{2})\b/);

    if (!yearMatch) {
        return null;
    }

    const year = parseInt(yearMatch[0]);

    // sanity check for realistic vehicle years
    const currentYear = new Date().getFullYear() + 1;

    if (year < 1980 || year > currentYear) {
        return null;
    }

    return year;

}
