import { getCachedProducts } from "./shopify_cache.js";

export function searchProducts(query) {

const products = getCachedProducts();

if (!products) return [];

const q = query.toLowerCase();

const matches = products.filter(p => {

const title = p.title.toLowerCase();

return title.includes(q);

});

return matches.slice(0,3);

}

export function buildQuickReply(products) {

if (!products || products.length === 0) {

return "Sorry, we couldn't find the product. Please send vehicle model and part name.";

}

let message = "Here are the best options:\n\n";

products.forEach((p,i)=>{

const price = p.variants[0]?.price || "N/A";

message += `${i+1}️⃣ ${p.title}\n`;
message += `Price: PKR ${price}\n`;
message += `https://ndestore.com/products/${p.handle}\n\n`;

});

message += "Reply with product number to order.";

return message;

}
