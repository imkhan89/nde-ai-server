// integrations/shopifyCheckout.js

function generateCheckoutLink(cart) {
  if (!cart.length) return null;

  const domain = process.env.SHOPIFY_DOMAIN;

  const items = cart
    .map(p => `${p.variant_id}:1`)
    .join(",");

  return `https://${domain}/cart/${items}`;
}

module.exports = {
  generateCheckoutLink
};
