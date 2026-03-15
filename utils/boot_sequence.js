import { validateEnv } from "./env_validator.js";
import { info } from "./logger.js";

export async function runBootSequence() {
  try {
    info("Starting boot sequence...");

    validateEnv();

    info("Environment validation passed");

    info("Boot sequence completed");

    return true;
  } catch (error) {
    console.error("Boot sequence failed:", error);
    process.exit(1);
  }
}

export default {
  runBootSequence
};
