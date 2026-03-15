import { runShopifySync } from "../sync/shopify_sync.js";

let syncInterval = null;

export function startSyncScheduler() {
  const intervalMinutes = Number(process.env.SHOPIFY_SYNC_INTERVAL || 60);

  const intervalMs = intervalMinutes * 60 * 1000;

  console.log(`Shopify Sync Scheduler started (every ${intervalMinutes} minutes)`);

  runShopifySync().catch((err) => {
    console.error("Initial Shopify Sync failed:", err);
  });

  syncInterval = setInterval(async () => {
    try {
      console.log("Running scheduled Shopify sync...");
      await runShopifySync();
      console.log("Scheduled Shopify sync completed");
    } catch (err) {
      console.error("Scheduled Shopify sync failed:", err);
    }
  }, intervalMs);
}

export function stopSyncScheduler() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log("Shopify Sync Scheduler stopped");
  }
}

export default {
  startSyncScheduler,
  stopSyncScheduler
};
