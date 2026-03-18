// conversation-engine/intentDetector.js

function detectIntent(userInput) {
  const text = userInput.toLowerCase().trim();

  const greetings = ["hi", "hello", "assalam", "aoa", "hey"];
  const menuTriggers = ["menu", "start", "options"];

  // Greeting
  if (greetings.includes(text)) {
    return "GREETING";
  }

  // Menu
  if (menuTriggers.includes(text)) {
    return "MENU";
  }

  // Number selection (1–6)
  if (/^[1-6]$/.test(text)) {
    return "MENU_SELECTION";
  }

  return "PRODUCT_QUERY";
}

module.exports = {
  detectIntent
};
