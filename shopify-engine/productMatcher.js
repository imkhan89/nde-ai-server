// shopify-engine/productMatcher.js

const axios = require("axios");
const { normalizePart } = require("../ai-engine/learningNormalizer");

// -----------------------------
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// -----------------------------
// FETCH PRODUCTS
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
    console.error("Shopify error:", err.response?.data || err.message);
    return [];
  }
}

// -----------------------------
// TAG MATCHING
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
// MATCH SINGLE PART
// -----------------------------
async function matchSinglePart(rawPart, vehicle, products) {
  const normalized = normalizePart(rawPart);

  const query = {
    part: normalized.normalized_part,
    make: vehicle.make?.toLowerCase(),
    model: vehicle.model?.toLowerCase(),
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

  if (!productType) {
    return {
      part: query.part,
      results: []
    };
  }

  let matches = [];

  products.forEach(p => {
    if (!p.product_type.toLowerCase().includes(productType.toLowerCase())) return;

    const score = matchTags(p, query);

    // ✅ less strict
    if (score >= 20) {
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
// MAIN MATCHER
// -----------------------------
async function matchProducts(parsedInput) {
  const { vehicle, parts } = parsedInput;

  const products = await fetchProducts();

  let finalResults = [];

  for (let partObj of parts) {
    const result = await matchSinglePart(partObj.raw, vehicle, products);
    finalResults.push(result);
  }

  return finalResults;
}

// -----------------------------
// RESPONSE FORMAT (HYBRID)
// -----------------------------
function formatResponse(results, vehicle) {
  let message = "Vehicle Details:\n\n";

  message += `Make: ${vehicle.make}\n`;
  message += `Model: ${vehicle.model}\n`;
  message += `Year: ${vehicle.year}\n\n`;

  results.forEach(r => {
    const partName = r.part.replace("_", " ");

    message += `Part: ${partName}\n\n`;

    if (r.results.length) {
      r.results.forEach(p => {
        message += `https://ndestore.com/products/${p.handle}\n\n`;
      });
    } else {
      // ✅ fallback search
      const query = `${vehicle.make} ${vehicle.model} ${partName} ${vehicle.year}`;
      const url = `https://www.ndestore.com/search?q=${encodeURIComponent(query)}`;

      message += `${url}\n\n`;
    }
  });

  message += "Reply # to return to Main Menu.";

  return message.trim();
}

// -----------------------------
module.exports = {
  matchProducts,
  formatResponse
};
