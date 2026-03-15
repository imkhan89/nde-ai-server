/*
NDE Automotive AI
ID Generator
*/

import crypto from "crypto";

export function generateId(length = 16) {

  return crypto
    .randomBytes(length)
    .toString("hex")
    .slice(0, length);

}

export function generateUUID() {

  return crypto.randomUUID();

}

export function shortId() {

  return crypto
    .randomBytes(6)
    .toString("base64")
    .replace(/[+/=]/g, "")
    .slice(0, 8);

}
