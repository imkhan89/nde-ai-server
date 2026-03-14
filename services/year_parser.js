// services/year_parser.js

export function detectYear(query) {

    if (!query || typeof query !== "string") {
        return null;
    }

    const matches = query.match(/\b(19\d{2}|20\d{2})\b/g);

    if (!matches || matches.length === 0) {
        return null;
    }

    const currentYear = new Date().getFullYear() + 1;

    for (const match of matches) {

        const year = parseInt(match);

        if (year >= 1980 && year <= currentYear) {
            return year;
        }

    }

    return null;

}
