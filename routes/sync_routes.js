import express from "express";
import { runShopifySync } from "../services/shopify_sync_engine.js";

const router = express.Router();

/*
NDE Automotive AI
Shopify Sync Routes
*/

router.post("/sync/shopify", async (req, res) => {

  try {

    const result = await runShopifySync();

    res.json({
      success: result.success,
      indexed: result.indexed
    });

  } catch (error) {

    console.error("Shopify sync route error:", error);

    res.status(500).json({
      success: false,
      indexed: 0
    });

  }

});

/*
Sync health
*/

router.get("/sync/health", (req, res) => {

  res.json({
    status: "ok",
    service: "Shopify Sync Engine"
  });

});

export default router;
