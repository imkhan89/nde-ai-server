/*
NDE Automotive AI
Process Monitor
*/

import { getSystemInfo, getMemoryUsage } from "./system_info.js";

export function getProcessHealth() {

  const system = getSystemInfo();

  const memory = getMemoryUsage();

  const load = process.cpuUsage();

  return {
    system,
    memory,
    cpu_usage: load,
    uptime_seconds: process.uptime()
  };

}

export function logProcessHealth() {

  const health = getProcessHealth();

  console.log("Process Health:", JSON.stringify(health));

}
