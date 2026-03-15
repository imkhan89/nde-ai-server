/*
NDE Automotive AI
Startup Banner
*/

import { getVersionInfo } from "./version_info.js";

export function printBanner() {

  const info = getVersionInfo();

  const banner = `
========================================
        NDE AUTOMOTIVE AI ENGINE
========================================
Version : ${info.version}
Build   : ${info.build}
Engine  : ${info.engine}
Node    : ${info.node}
Start   : ${info.timestamp}
========================================
`;

  console.log(banner);

}
