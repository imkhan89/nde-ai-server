/*
NDE Automotive AI
Central Logger
*/

import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");

function ensureLogDir() {

  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }

}

function writeLog(level, message, meta = {}) {

  try {

    ensureLogDir();

    const entry = {
      time: new Date().toISOString(),
      level,
      message,
      ...meta
    };

    const line = JSON.stringify(entry) + "\n";

    fs.appendFileSync(
      path.join(LOG_DIR, "app.log"),
      line
    );

  } catch (err) {

    console.error("Logger failure:", err);

  }

}

export function logInfo(message, meta = {}) {

  console.log("[INFO]", message);

  writeLog("info", message, meta);

}

export function logWarn(message, meta = {}) {

  console.warn("[WARN]", message);

  writeLog("warn", message, meta);

}

export function logError(message, meta = {}) {

  console.error("[ERROR]", message);

  writeLog("error", message, meta);

}
