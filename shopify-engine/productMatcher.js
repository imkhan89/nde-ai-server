// shopify-engine/productMatcher.js

const axios = require("axios");
const { normalizePart } = require("../ai-engine/learningNormalizer");

// -----------------------------
// 🔐 CONFIG (SET YOUR VALUES)
// -----------------------------
const SHOPIFY_STORE = process.env.SHOPIFY_STORE; // example: ndestore.myshopify.com
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// -----------------------------
// 🌐 SHOPIFY API CALL
// -----------------------------
async function fetchProductsByType(productType) {
  try {
    const url = `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=50`;

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json"
      }
    });

    // Optional filter by product_type
    return response.data.products.filter(p =>
      p.product_type.toLowerCase().includes(productType.toLowerCase())
    );

  } catch (err) {
    console.error("Shopify API error:", err.message);
    return [];
  }
}

// -----------------------------
// 🧩 TAG MATCH CHECK
// -----------------------------
function matchTags(product, query) {
  const tags = product.tags.toLowerCase().split(",").map(t => t.trim());

  let score = 0;

  if (tags.includes(`make_${query.make}`)) score += 30;
  if (tags.includes(`model_${query.model}`)) score += 30;
  if (query.year && tags.includes(`year_${query.year}`)) score += 20;

  if (query.position) {
    if (tags.includes(`position_${query.position}`)) score += 10;
  }

  return score;
}

// -----------------------------
// 🧠 MAIN MATCHER
// -----------------------------
async function matchProducts(userInput, vehicle) {
  const partResult = normalizePart(userInput);

  const query = {
    part: partResult.normalized_part,
    make: vehicle.make.toLowerCase(),
    model: vehicle.model.toLowerCase(),
    year: vehicle.year,
    position: vehicle.position || null
  };

  // Convert canonical part → Shopify product_type
  const productTypeMap = {
    air_filter: "Air Filter",
    oil_filter: "Oil Filter",
    cabin_filter: "Cabin Filter",
    brake_pads: "Brake Pads"
  };

  const productType = productTypeMap[query.part];

  if (!productType) {
    return [];
  }

  const products = await fetchProductsByType(productType);

  let bestProducts = [];

  products.forEach(product => {
    const score = matchTags(product, query);

    if (score > 0) {
      bestProducts.push({
        title: product.title,
        handle: product.handle,
        score
      });
    }
  });

  // Sort by best score
  bestProducts.sort((a, b) => b.score - a.score);

  // Return top 3
  return bestProducts.slice(0, 3);
}

// -----------------------------
// 🔗 FORMAT RESPONSE
// -----------------------------
function formatResponse(products) {
  if (!products.length) {
    return "No exact match found. Please refine your query.";
  }

  let message = "Here are matching products:\n\n";

  products.forEach(p => {
    message += `${p.title}\nhttps://ndestore.com/products/${p.handle}\n\n`;
  });

  return message.trim();
}

// -----------------------------
// 📤 EXPORTS
// -----------------------------
module.exports = {
  matchProducts,
  formatResponse
};
