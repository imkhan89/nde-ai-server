import express from "express";
import { searchProducts } from "../services/search_engine.js";

const router = express.Router();

/*
NDE Automotive AI
Search API Routes
*/

router.get("/search", async (req, res) => {

  try {

    const query = req.query.q || "";

    const result = await searchProducts(query);

    res.json({
      success: true,
      query: query,
      parsed: result.parsed || null,
      intentScore: result.intentScore || 0,
      results: result.results || []
    });

  } catch (error) {

    console.error("Search Route Error:", error);

    res.status(500).json({
      success: false,
      message: "Search failed",
      results: []
    });

  }

});

/*
Health check
*/

router.get("/search/health", (req, res) => {

  res.json({
    status: "ok",
    service: "NDE Automotive AI Search"
  });

});

export default router;
