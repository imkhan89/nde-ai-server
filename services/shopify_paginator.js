/*
NDE Automotive AI
Shopify Paginator

Fetches all Shopify products using cursor-based pagination.
*/

export async function fetchAllShopifyProducts(store, token) {

  if (!store || !token) {
    throw new Error("Missing Shopify credentials");
  }

  let products = [];
  let nextUrl = `https://${store}/admin/api/2023-10/products.json?limit=250`;

  while (nextUrl) {

    const response = await fetch(nextUrl, {
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Shopify API request failed");
    }

    const data = await response.json();

    if (Array.isArray(data.products)) {
      products.push(...data.products);
    }

    const linkHeader = response.headers.get("link");

    nextUrl = null;

    if (linkHeader) {

      const match = linkHeader.match(/<([^>]+)>; rel="next"/);

      if (match) {
        nextUrl = match[1];
      }

    }

  }

  return products;

}
