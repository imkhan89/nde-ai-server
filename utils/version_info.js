/*
NDE Automotive AI
Version Info
*/

export const VERSION = {
  name: "NDE Automotive AI",
  version: "1.0.0",
  build: "2026.03",
  engine: "nde-ai-core",
  node: process.version
};

export function getVersionInfo() {

  return {
    ...VERSION,
    uptime_seconds: process.uptime(),
    timestamp: new Date().toISOString()
  };

}
