import express from "express";
import { runShopifySync } from "../sync/shopify_sync.js";

const router = express.Router();

router.post("/shopify", async (req, res) => {
  try {
    await runShopifySync();

    res.json({
      success: true,
      message: "Shopify sync completed"
    });
  } catch (error) {
    console.error("Shopify Sync Error:", error);

    res.status(500).json({
      success: false,
      message: "Shopify sync failed"
    });
  }
});

export default router;
