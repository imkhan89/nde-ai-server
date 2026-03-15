/*
NDE Automotive AI
File Utilities
*/

import fs from "fs";
import path from "path";

export function ensureDirectory(dirPath) {

  if (!dirPath) return;

  if (!fs.existsSync(dirPath)) {

    fs.mkdirSync(dirPath, { recursive: true });

  }

}

export function readJSON(filePath, fallback = null) {

  try {

    if (!fs.existsSync(filePath)) {
      return fallback;
    }

    const data = fs.readFileSync(filePath, "utf8");

    return JSON.parse(data);

  } catch {

    return fallback;

  }

}

export function writeJSON(filePath, data) {

  try {

    const dir = path.dirname(filePath);

    ensureDirectory(dir);

    fs.writeFileSync(
      filePath,
      JSON.stringify(data, null, 2),
      "utf8"
    );

    return true;

  } catch {

    return false;

  }

}

export function appendFile(filePath, content) {

  try {

    const dir = path.dirname(filePath);

    ensureDirectory(dir);

    fs.appendFileSync(filePath, content, "utf8");

    return true;

  } catch {

    return false;

  }

}

export function fileExists(filePath) {

  return fs.existsSync(filePath);

}
