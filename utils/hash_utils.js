/*
NDE Automotive AI
Hash Utilities
*/

import crypto from "crypto";

export function sha256(value) {

  if (!value) return "";

  return crypto
    .createHash("sha256")
    .update(String(value))
    .digest("hex");

}

export function md5(value) {

  if (!value) return "";

  return crypto
    .createHash("md5")
    .update(String(value))
    .digest("hex");

}

export function hashObject(obj) {

  if (!obj) return "";

  const json = JSON.stringify(obj);

  return sha256(json);

}
