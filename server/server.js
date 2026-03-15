import { launchServer } from "./server_launcher.js";

/*
NDE Automotive AI
Main Server Entry
*/

async function main() {

  try {

    await launchServer();

  } catch (error) {

    console.error("Fatal startup error:", error);

    process.exit(1);

  }

}

main();
