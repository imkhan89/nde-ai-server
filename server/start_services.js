import { bootstrapAI } from "./ai_bootstrap.js";
import { optimizeRelevance } from "../services/relevance_optimizer.js";
import { runAutoLearning } from "../services/auto_learning_engine.js";

/*
NDE Automotive AI
Service Starter

Starts background services:
- AI bootstrap
- Relevance optimizer
- Auto learning
*/

let started = false;

export async function startServices() {

  if (started) {
    return;
  }

  try {

    await bootstrapAI();

    /*
    Run periodic AI optimizations
    */

    setInterval(() => {

      try {
        optimizeRelevance();
      } catch (err) {
        console.error("Relevance optimizer error:", err);
      }

    }, 1000 * 60 * 5); // every 5 minutes

    /*
    Run auto-learning
    */

    setInterval(() => {

      try {
        runAutoLearning();
      } catch (err) {
        console.error("Auto learning error:", err);
      }

    }, 1000 * 60 * 10); // every 10 minutes

    started = true;

    console.log("NDE Automotive AI background services started");

  } catch (error) {

    console.error("Service startup error:", error);

  }

}
