// conversation-engine/cartManager.js

const carts = {};

// -----------------------------
// GET CART
// -----------------------------
function getCart(userId) {
  if (!carts[userId]) {
    carts[userId] = [];
  }
  return carts[userId];
}

// -----------------------------
// ADD TO CART
// -----------------------------
function addToCart(userId, product) {
  const cart = getCart(userId);
  cart.push(product);
}

// -----------------------------
// CLEAR CART
// -----------------------------
function clearCart(userId) {
  carts[userId] = [];
}

// -----------------------------
// GET CART SUMMARY
// -----------------------------
function getCartSummary(userId) {
  const cart = getCart(userId);

  if (!cart.length) return "Cart is empty.";

  let msg = "🛒 Your Cart:\n\n";

  cart.forEach((p, i) => {
    msg += `${i + 1}. ${p.title} - PKR ${p.price}\n`;
  });

  return msg;
}

module.exports = {
  getCart,
  addToCart,
  clearCart,
  getCartSummary
};
