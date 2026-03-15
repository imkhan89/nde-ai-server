import { normalizeQuery } from "./query_normalizer.js";
import { searchProducts, formatProductResults } from "./product_search.js";
import { detectCustomerCountry } from "./customer_location.js";

export async function processAIQuery(message, from) {
  const text = message.toLowerCase();

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("assalam")
  ) {
    return "Welcome to ndestore.com.\nPlease tell me your car model, year, and the part you are looking for.";
  }

  const country = detectCustomerCountry(from);

  const normalizedQuery = normalizeQuery(message);

  const products = searchProducts(normalizedQuery);

  if (products.length === 0) {
    return "I couldn't find an exact match on ndestore.com.\nPlease include vehicle model, year, and part name.";
  }

  const response = formatProductResults(products);

  return `${response}\n\nServing customers worldwide from ndestore.com.`;
}
