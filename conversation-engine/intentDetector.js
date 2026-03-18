// conversation-engine/intentDetector.js

function detectIntent(userInput) {
  const text = userInput.toLowerCase();

  const greetings = ["hi", "hello", "assalam", "aoa", "hey"];
  const menuTriggers = ["menu", "start", "options"];

  // Greeting intent
  if (greetings.some(g => text.includes(g))) {
    return "GREETING";
  }

  // Menu intent
  if (menuTriggers.some(m => text.includes(m))) {
    return "MENU";
  }

  return "PRODUCT_QUERY";
}

module.exports = {
  detectIntent
};
