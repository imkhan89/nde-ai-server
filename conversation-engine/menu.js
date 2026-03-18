// conversation-engine/menu.js

function getMainMenu() {
  return `Welcome to ndestore.com AI Support 🚗

Please choose an option:

1️⃣ Auto Parts
2️⃣ Car Accessories
3️⃣ Sticker Decals
4️⃣ Order Status
5️⃣ Chat Support
6️⃣ Complaints

Reply with 1-6 to continue.`;
}

// ✅ AUTO PARTS STRUCTURED PROMPT (FIX)
function getAutoPartsPrompt() {
  return `Auto Parts Inquiry

Share details:
Part Name:
Make:
Model:
Year:

Example:
Air Filter Suzuki Swift 2021`;
}

module.exports = {
  getMainMenu,
  getAutoPartsPrompt
};
