const { detectVehicle } = require('./vehicle_parser');
const { detectYear } = require('./year_parser');
const { detectPart } = require('./part_parser');
const { searchProducts } = require('./product_search');

async function processMessage(message) {

  const vehicle = detectVehicle(message);
  const year = detectYear(message);
  const part = detectPart(message);

  if (!part) {
    return "Please tell us which auto part you need.";
  }

  const products = await searchProducts(part);

  if (!products.length) {
    return "Sorry, we couldn't find that product.";
  }

  let response = "";

  if (vehicle && year) {
    response += `For ${vehicle} ${year}:\n\n`;
  }

  response += "Available options:\n\n";

  products.forEach((p, index) => {
    response += `${index + 1}. ${p.title}\n`;
  });

  return response;
}

module.exports = {
  processMessage
};
