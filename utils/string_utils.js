/*
NDE Automotive AI
String Utilities
*/

export function normalizeString(value) {

  if (!value) return "";

  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

}

export function removeSpecialCharacters(value) {

  if (!value) return "";

  return value.replace(/[^\w\s]/g, " ");

}

export function tokenize(value) {

  if (!value) return [];

  return normalizeString(value)
    .split(" ")
    .filter(token => token.length > 1);

}

export function containsWord(text, word) {

  if (!text || !word) return false;

  const tokens = tokenize(text);

  return tokens.includes(normalizeString(word));

}

export function similarityScore(a, b) {

  if (!a || !b) return 0;

  const tokensA = tokenize(a);
  const tokensB = tokenize(b);

  const setB = new Set(tokensB);

  let matches = 0;

  for (const token of tokensA) {

    if (setB.has(token)) {
      matches++;
    }

  }

  return matches / Math.max(tokensA.length, tokensB.length, 1);

}
