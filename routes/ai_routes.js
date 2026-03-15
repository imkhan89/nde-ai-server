import express from "express";
import { executeSearch } from "../services/pipeline_controller.js";
import { analyzeSearchTrends } from "../services/analytics_engine.js";

const router = express.Router();

/*
NDE Automotive AI
Primary AI API Routes
*/

router.get("/ai/search", async (req, res) => {

  try {

    const query = req.query.q || "";

    const result = await executeSearch(query);

    res.json({
      success: true,
      query,
      parsed: result.parsed || null,
      results: result.results || []
    });

  } catch (error) {

    console.error("AI Search Error:", error);

    res.status(500).json({
      success: false,
      message: "AI search failed",
      results: []
    });

  }

});

/*
Search analytics endpoint
*/

router.get("/ai/analytics", (req, res) => {

  try {

    const analytics = analyzeSearchTrends(1000);

    res.json({
      success: true,
      analytics
    });

  } catch (error) {

    console.error("Analytics Error:", error);

    res.status(500).json({
      success: false
    });

  }

});

/*
Health check
*/

router.get("/ai/health", (req, res) => {

  res.json({
    status: "ok",
    service: "NDE Automotive AI Engine"
  });

});

export default router;
