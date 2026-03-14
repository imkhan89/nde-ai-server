// services/query_normalizer.js

import { SPELLING_DICTIONARY } from "../data/spelling_dictionary.js";

export function queryNormalizer(message) {

    if (!message || typeof message !== "string") {
        return "";
    }

    // convert to lowercase
    let normalized = message.toLowerCase();

    // remove punctuation
    normalized = normalized.replace(/[^\w\s]/g, " ");

    // normalize whitespace
    normalized = normalized.replace(/\s+/g, " ").trim();

    // tokenize
    const tokens = normalized.split(" ");

    const correctedTokens = tokens.map(token => {

        if (SPELLING_DICTIONARY[token]) {
            return SPELLING_DICTIONARY[token];
        }

        return token;

    });

    return correctedTokens.join(" ");

}
