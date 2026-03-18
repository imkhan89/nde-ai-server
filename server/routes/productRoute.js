// server/routes/productRoute.js

const express = require("express");
const router = express.Router();

const { matchProducts, formatResponse } = require("../../shopify-engine/productMatcher");

// Example test route
router.post("/match", async (req, res) => {
  try {
    const { userInput, vehicle } = req.body;

    const products = await matchProducts(userInput, vehicle);
    const message = formatResponse(products);

    res.json({
      success: true,
      message,
      products
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error matching products"
    });
  }
});

module.exports = router;
