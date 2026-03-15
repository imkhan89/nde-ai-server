import fetch from "node-fetch";

const API_VERSION = "2024-01";
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;

function buildUrl(pageInfo = null) {
  let url = `https://${SHOPIFY_STORE}/admin/api/${API_VERSION}/products.json?limit=250`;

  if (pageInfo) {
    url += `&page_info=${pageInfo}`;
  }

  return url;
}

function extractNextPage(linkHeader) {
  if (!linkHeader) return null;

  const parts = linkHeader.split(",");

  for (const part of parts) {
    if (part.includes('rel="next"')) {
      const match = part.match(/page_info=([^&>]+)/);
      if (match) return match[1];
    }
  }

  return null;
}

export async function fetchShopifyPage(pageInfo = null) {
  const url = buildUrl(pageInfo);

  const response = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": SHOPIFY_TOKEN,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Shopify API Error: ${response.status}`);
  }

  const data = await response.json();
  const linkHeader = response.headers.get("link");

  return {
    products: data.products || [],
    nextPage: extractNextPage(linkHeader)
  };
}

export default {
  fetchShopifyPage
};
