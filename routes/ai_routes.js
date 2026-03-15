import express from "express";
import { runSearchPipeline } from "../services/search_pipeline.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || "";

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter 'q' is required"
      });
    }

    const results = await runSearchPipeline(query);

    res.json({
      success: true,
      query,
      results,
      count: results.length
    });

  } catch (error) {
    console.error("AI Search Error:", error);

    res.status(500).json({
      success: false,
      message: "AI search failed"
    });
  }
});

export default router;
