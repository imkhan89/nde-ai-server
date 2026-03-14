const parts = [
  "wiper",
  "wiper blade",
  "brake pad",
  "brake pads",
  "air filter",
  "oil filter",
  "cabin filter",
  "spark plug",
  "radiator",
  "coolant",
  "horn",
  "bumper",
  "bonnet",
  "fender",
  "radiator cap"
];

function detectPart(message) {

  const msg = message.toLowerCase();

  for (const part of parts) {
    if (msg.includes(part)) {
      return part;
    }
  }

  return null;
}

module.exports = {
  detectPart
};
