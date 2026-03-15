/*
NDE Automotive AI
Boot Sequence
*/

import { printBanner } from "./banner.js";
import { runStartupChecks } from "./startup_checks.js";
import { runtimeState } from "./runtime_state.js";
import { shutdownManager } from "./shutdown_manager.js";

export function runBootSequence() {

  printBanner();

  const checks = runStartupChecks();

  runtimeState.set("boot_checks", checks);

  shutdownManager.initialize();

  runtimeState.setFlag("boot_completed", true);

  console.log("Boot sequence completed");

  return {
    success: true,
    checks
  };

}
