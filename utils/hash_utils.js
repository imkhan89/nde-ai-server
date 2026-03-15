import crypto from "crypto";

export function hashString(input = "") {
  return crypto
    .createHash("sha256")
    .update(input)
    .digest("hex");
}

export function hashObject(obj = {}) {
  const str = JSON.stringify(obj);
  return hashString(str);
}

export default {
  hashString,
  hashObject
};
