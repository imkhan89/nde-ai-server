/*
NDE Automotive AI
Safe JSON Utilities
*/

export function safeParseJSON(value, fallback = null) {

  if (!value) return fallback;

  if (typeof value === "object") return value;

  try {

    return JSON.parse(value);

  } catch {

    return fallback;

  }

}

export function safeStringifyJSON(value, fallback = "{}") {

  try {

    return JSON.stringify(value);

  } catch {

    return fallback;

  }

}

export function prettyJSON(value) {

  try {

    return JSON.stringify(value, null, 2);

  } catch {

    return "{}";

  }

}
