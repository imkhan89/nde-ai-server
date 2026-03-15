import { runShopifySync } from "./shopify_sync_engine.js";

/*
NDE Automotive AI
Scheduler

Runs automated background jobs such as Shopify product sync.
*/

let schedulerStarted = false;

export function startScheduler() {

  if (schedulerStarted) {
    return;
  }

  schedulerStarted = true;

  /*
  Run Shopify sync every 30 minutes
  */

  setInterval(async () => {

    try {

      const result = await runShopifySync();

      if (result?.success) {
        console.log(`Scheduled Shopify sync completed. Indexed: ${result.indexed}`);
      }

    } catch (error) {

      console.error("Scheduled Shopify sync failed:", error);

    }

  }, 1000 * 60 * 30);

}
