const vehicles = [
  "corolla",
  "civic",
  "city",
  "hilux",
  "prado",
  "vigo",
  "revo",
  "fortuner",
  "yaris",
  "mehran",
  "cultus",
  "alto",
  "wagon r",
  "swift"
];

function detectVehicle(message) {
  const msg = message.toLowerCase();

  for (const vehicle of vehicles) {
    if (msg.includes(vehicle)) {
      return vehicle;
    }
  }

  return null;
}

module.exports = {
  detectVehicle
};
