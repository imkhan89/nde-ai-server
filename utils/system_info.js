/*
NDE Automotive AI
System Info Utility
*/

import os from "os";

export function getSystemInfo() {

  const cpus = os.cpus() || [];

  return {
    platform: os.platform(),
    arch: os.arch(),
    cpu_count: cpus.length,
    cpu_model: cpus[0]?.model || "",
    memory_total: os.totalmem(),
    memory_free: os.freemem(),
    uptime_seconds: os.uptime(),
    node_version: process.version,
    pid: process.pid
  };

}

export function getMemoryUsage() {

  const mem = process.memoryUsage();

  return {
    rss: mem.rss,
    heap_total: mem.heapTotal,
    heap_used: mem.heapUsed,
    external: mem.external
  };

}
