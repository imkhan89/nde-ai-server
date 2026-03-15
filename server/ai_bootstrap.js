import { startAutoOptimizer } from "../database/auto_optimizer.js";
import { getDatabase } from "../database/database.js";

/*
NDE Automotive AI
Bootstrap System

Initializes database
Starts AI auto-learning
Starts performance optimizer
*/

let initialized = false;

export async function bootstrapAI() {

  if (initialized) {
    return;
  }

  try {

    /*
    Initialize database
    */

    await getDatabase();

    /*
    Start AI optimizer
    */

    startAutoOptimizer();

    /*
    AI ready
    */

    initialized = true;

    console.log("NDE Automotive AI initialized");

  } catch (error) {

    console.error("AI Bootstrap Error:", error);

  }

}
