// services/query_normalizer.js

import { SPELLING_DICTIONARY } from "../data/spelling_dictionary.js";

export function queryNormalizer(message) {

    if (!message || typeof message !== "string") {
        return "";
    }

    let normalized = message.toLowerCase();

    // Remove punctuation
    normalized = normalized.replace(/[^\w\s]/g, " ");

    // Normalize whitespace
    normalized = normalized.replace(/\s+/g, " ").trim();

    const tokens = normalized.split(" ");

    const correctedTokens = tokens.map(token => {

        if (SPELLING_DICTIONARY[token]) {
            return SPELLING_DICTIONARY[token];
        }

        return token;

    });

    return correctedTokens.join(" ");

}
