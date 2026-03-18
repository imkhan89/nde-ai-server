// shopify-engine/productMatcher.js

const axios = require("axios");
const { normalizePart } = require("../ai-engine/learningNormalizer");

// -----------------------------
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// -----------------------------
async function fetchProducts() {
  try {
    const url = `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json?limit=50`;

    const res = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN
      }
    });

    return res.data.products || [];
  } catch (err) {
    console.error("Shopify error:", err.message);
    return [];
  }
}

// -----------------------------
function matchTags(product, query) {
  const tags = product.tags.toLowerCase().split(",").map(t => t.trim());

  let score = 0;

  if (tags.includes(`make_${query.make}`)) score += 30;
  if (tags.includes(`model_${query.model}`)) score += 30;
  if (query.year && tags.includes(`year_${query.year}`)) score += 20;

  if (query.position) {
    const positions = query.position.split("_");
    positions.forEach(p => {
      if (tags.includes(`position_${p}`)) score += 10;
    });
  }

  return score;
}

// -----------------------------
async function matchSinglePart(rawPart, vehicle) {
  const normalized = normalizePart(rawPart);

  const query = {
    part: normalized.normalized_part,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    position: rawPart.position || null
  };

  const productTypeMap = {
    air_filter: "Air Filter",
    oil_filter: "Oil Filter",
    cabin_filter: "Cabin Filter",
    brake_pads: "Brake Pads"
  };

  const productType = productTypeMap[query.part];

  const products = await fetchProducts();

  let matches = [];

  products.forEach(p => {
    if (!p.product_type.toLowerCase().includes(productType.toLowerCase())) return;

    const score = matchTags(p, query);

    if (score > 0) {
      matches.push({
        title: p.title,
        handle: p.handle,
        score
      });
    }
  });

  matches.sort((a, b) => b.score - a.score);

  return {
    part: query.part,
    results: matches.slice(0, 2)
  };
}

// -----------------------------
async function matchProducts(parsedInput) {
  const { vehicle, parts } = parsedInput;

  let finalResults = [];

  for (let partObj of parts) {
    const result = await matchSinglePart(partObj.raw, vehicle);
    finalResults.push(result);
  }

  return finalResults;
}

// -----------------------------
function formatResponse(results) {
  if (!results.length) {
    return "No matching products found.";
  }

  let message = "Here are your results:\n\n";

  results.forEach(r => {
    message += `${r.part.toUpperCase()}:\n`;

    if (!r.results.length) {
      message += "No match found\n\n";
      return;
    }

    r.results.forEach(p => {
      message += `${p.title}\nhttps://ndestore.com/products/${p.handle}\n\n`;
    });
  });

  return message.trim();
}

// -----------------------------
module.exports = {
  matchProducts,
  formatResponse
};
