/*
NDE Automotive AI
Health Snapshot Utility
*/

import { getSystemInfo, getMemoryUsage } from "./system_info.js";
import { cacheSize } from "./cache_utils.js";

export function createHealthSnapshot() {

  return {
    time: new Date().toISOString(),
    system: getSystemInfo(),
    memory: getMemoryUsage(),
    cache_items: cacheSize(),
    uptime_seconds: process.uptime()
  };

}

export function logHealthSnapshot() {

  const snapshot = createHealthSnapshot();

  console.log("Health Snapshot:", JSON.stringify(snapshot));

}
