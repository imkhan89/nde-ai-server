/*
NDE Automotive AI
Startup Checks
*/

import { validateEnvironment } from "./env_validator.js";
import { getSystemInfo } from "./system_info.js";

export function runStartupChecks() {

  const env = validateEnvironment();

  const system = getSystemInfo();

  if (!env.valid) {

    console.warn("Environment validation failed");

  }

  console.log("System Info:", JSON.stringify(system));

  return {
    environment: env,
    system
  };

}
