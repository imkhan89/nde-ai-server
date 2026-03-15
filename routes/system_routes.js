import express from "express";
import { getSystemHealth } from "../services/health_monitor.js";
import { getCacheStats } from "../services/search_cache.js";
import { analyzeSearchTrends } from "../services/analytics_engine.js";

const router = express.Router();

/*
NDE Automotive AI
System Monitoring Routes
*/

router.get("/system/health", (req, res) => {

  try {

    const health = getSystemHealth();

    res.json({
      success: true,
      health
    });

  } catch (error) {

    console.error("Health route error:", error);

    res.status(500).json({
      success: false
    });

  }

});

router.get("/system/cache", (req, res) => {

  try {

    const stats = getCacheStats();

    res.json({
      success: true,
      cache: stats
    });

  } catch (error) {

    console.error("Cache route error:", error);

    res.status(500).json({
      success: false
    });

  }

});

router.get("/system/analytics", (req, res) => {

  try {

    const analytics = analyzeSearchTrends(1000);

    res.json({
      success: true,
      analytics
    });

  } catch (error) {

    console.error("Analytics route error:", error);

    res.status(500).json({
      success: false
    });

  }

});

export default router;
