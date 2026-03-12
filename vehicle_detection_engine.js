const fs = require("fs");
const path = require("path");

const vehicles = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "data", "vehicle_graph.json"),
    "utf8"
  )
);

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function detectVehicle(query) {

  const q = normalize(query);

  for (const vehicle of vehicles) {

    const brand = vehicle.brand ? vehicle.brand.toLowerCase() : "";
    const model = vehicle.model ? vehicle.model.toLowerCase() : "";
    const variant = vehicle.variant ? vehicle.variant.toLowerCase() : "";

    if (q.includes(brand) && q.includes(model)) {
      return vehicle;
    }

    if (q.includes(model) && q.includes(variant)) {
      return vehicle;
    }

    if (q.includes(model)) {
      return vehicle;
    }

  }

  return null;
}

module.exports = detectVehicle;
