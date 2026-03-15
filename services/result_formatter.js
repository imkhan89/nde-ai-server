/*
NDE Automotive AI
Result Formatter

Formats product results before sending them to the API.
Ensures consistent structure and safe output.
*/

export function formatResults(products = []) {

  if (!Array.isArray(products)) {
    return [];
  }

  return products.map(formatProduct);

}

function formatProduct(product) {

  if (!product) {
    return null;
  }

  return {
    id: product.id || null,
    title: product.title || "",
    sku: product.sku || "",
    brand: product.brand || "",
    category: product.category || "",
    vehicle: {
      make: product.vehicle_make || null,
      model: product.vehicle_model || null,
      year: product.vehicle_year || null
    },
    price: normalizePrice(product.price),
    score: product.score || 0,
    raw: safeParse(product.data)
  };

}

function normalizePrice(price) {

  const p = parseFloat(price);

  if (isNaN(p)) {
    return 0;
  }

  return Number(p.toFixed(2));

}

function safeParse(data) {

  if (!data) return null;

  try {

    if (typeof data === "object") {
      return data;
    }

    return JSON.parse(data);

  } catch {

    return null;

  }

}
