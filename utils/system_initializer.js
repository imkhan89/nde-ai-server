/*
NDE Automotive AI
System Initializer
Final bootstrap layer that initializes the entire runtime environment.
*/

import { runBootSequence } from "./boot_sequence.js";
import { runtimeState } from "./runtime_state.js";
import { serviceRegistry } from "./service_registry.js";
import { featureFlags } from "./feature_flags.js";

export function initializeSystem() {

  const boot = runBootSequence();

  /*
  Default feature flags
  */

  featureFlags.enable("ai_search");
  featureFlags.enable("analytics");
  featureFlags.enable("auto_learning");
  featureFlags.enable("knowledge_graph");

  /*
  Register core runtime services
  */

  serviceRegistry.register("runtimeState", runtimeState);
  serviceRegistry.register("featureFlags", featureFlags);

  runtimeState.set("system_initialized", true);

  console.log("NDE Automotive AI fully initialized");

  return {
    success: true,
    boot
  };

}
