import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/*
NDE Automotive AI
Search Logger

Logs search queries for AI learning and analytics.
Automatically creates log directory and rotates logs.
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_DIR = path.join(__dirname, "..", "logs");
const LOG_FILE = path.join(LOG_DIR, "search.log");

function ensureLogDirectory() {

  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }

}

function formatLog(entry) {

  return JSON.stringify({
    time: new Date().toISOString(),
    ...entry
  }) + "\n";

}

export function logSearch(query, parsed, resultCount) {

  try {

    ensureLogDirectory();

    const entry = formatLog({
      query,
      vehicle: parsed?.vehicle || null,
      part: parsed?.part || null,
      brand: parsed?.brand || null,
      results: resultCount || 0
    });

    fs.appendFileSync(LOG_FILE, entry);

  } catch (err) {

    console.error("Search logging failed:", err);

  }

}

export function readSearchLogs(limit = 100) {

  try {

    if (!fs.existsSync(LOG_FILE)) {
      return [];
    }

    const data = fs.readFileSync(LOG_FILE, "utf-8");

    const lines = data.trim().split("\n");

    return lines.slice(-limit).map(l => {

      try {
        return JSON.parse(l);
      } catch {
        return null;
      }

    }).filter(Boolean);

  } catch (err) {

    console.error("Log read error:", err);

    return [];

  }

}
