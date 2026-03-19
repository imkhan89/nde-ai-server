const express = require("express");
const router = express.Router();

const { parseUserInput } = require("../ai-engine/parser");
const { searchFitment, formatResponse, getCatalog } = require("../fitmentService");

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Product API is running"
  });
});

router.get("/catalog", (req, res) => {
  const catalog = getCatalog();
  res.json({
    success: true,
    makes: catalog.makes.length,
    models: catalog.allModels.length,
    parts: catalog.parts.length,
    catalog
  });
});

router.get("/search", (req, res) => {
  const query = String(req.query.q || "").trim();

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Query is required"
    });
  }

  const parsed = parseUserInput(query);
  const { make, model, year } = parsed.vehicle;
  const part = parsed.parts?.[0]?.raw || "";

  const results = searchFitment({
    part,
    make,
    model,
    year
  });

  res.json({
    success: true,
    query,
    parsed,
    results,
    message: formatResponse(results, `${make || ""} ${model || ""} ${year || ""}`.trim(), part)
  });
});

router.post("/match", (req, res) => {
  const query = String(req.body?.query || "").trim();

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "query is required"
    });
  }

  const parsed = parseUserInput(query);
  const { make, model, year } = parsed.vehicle;
  const part = parsed.parts?.[0]?.raw || "";

  const results = searchFitment({
    part,
    make,
    model,
    year
  });

  res.json({
    success: true,
    parsed,
    results,
    message: formatResponse(results, `${make || ""} ${model || ""} ${year || ""}`.trim(), part)
  });
});

module.exports = router;
