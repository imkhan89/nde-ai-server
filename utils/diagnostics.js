/*
NDE Automotive AI
Diagnostics Utility
*/

import { getProcessHealth } from "./process_monitor.js";
import { createHealthSnapshot } from "./health_snapshot.js";
import { serviceHealthRegistry } from "./service_health_registry.js";

export async function runDiagnostics() {

  const processHealth = getProcessHealth();

  const snapshot = createHealthSnapshot();

  const services = await serviceHealthRegistry.checkAll();

  return {
    timestamp: new Date().toISOString(),
    process: processHealth,
    snapshot,
    services
  };

}

export async function printDiagnostics() {

  const diagnostics = await runDiagnostics();

  console.log("Diagnostics Report:");

  console.log(JSON.stringify(diagnostics, null, 2));

  return diagnostics;

}
