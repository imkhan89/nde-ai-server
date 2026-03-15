import { getCachedProducts } from "../sync/shopify_sync.js";

export function searchProducts(query) {
  const products = getCachedProducts();

  if (!products || products.length === 0) {
    return [];
  }

  const q = query.toLowerCase();

  const results = products.filter((product) => {
    const title = product.title?.toLowerCase() || "";
    const body = product.body_html?.toLowerCase() || "";
    const tags = product.tags?.toLowerCase() || "";

    return (
      title.includes(q) ||
      body.includes(q) ||
      tags.includes(q)
    );
  });

  return results.slice(0, 5);
}

export function formatProductResults(products) {
  if (!products || products.length === 0) {
    return "I couldn't find a matching product on ndestore.com. Please provide vehicle model, year, and part name.";
  }

  let message = "Here are some products available on ndestore.com:\n\n";

  for (const product of products) {
    const title = product.title;
    const handle = product.handle;

    const price =
      product.variants && product.variants.length > 0
        ? product.variants[0].price
        : "N/A";

    const link = `https://www.ndestore.com/products/${handle}`;

    message += `${title}\nPKR ${price}\n${link}\n\n`;
  }

  return message.trim();
}
