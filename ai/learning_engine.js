// ✅ AI LEARNING ENGINE (AUTO BUILDS KEYWORDS FROM SHOPIFY)

export let AI_DICTIONARY = {};
export let AI_PRODUCT_INDEX = [];

// ✅ NORMALIZE
function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
}

// ✅ TOKENIZE
function tokenize(text) {
  return normalize(text)
    .split(" ")
    .filter((w) => w.length > 2);
}

// ✅ BUILD AI KNOWLEDGE
export function trainAI(products) {
  AI_DICTIONARY = {};
  AI_PRODUCT_INDEX = [];

  products.forEach((p) => {
    const text = `${p.title} ${p.tags || ""}`;
    const tokens = tokenize(text);

    AI_PRODUCT_INDEX.push({
      product: p,
      tokens,
    });

    tokens.forEach((t) => {
      if (!AI_DICTIONARY[t]) {
        AI_DICTIONARY[t] = new Set();
      }

      tokens.forEach((related) => {
        if (t !== related) {
          AI_DICTIONARY[t].add(related);
        }
      });
    });
  });

  console.log("AI trained on products:", AI_PRODUCT_INDEX.length);
}
