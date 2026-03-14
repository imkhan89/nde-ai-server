import { detectVehicle } from "./vehicle_parser.js"
import { detectYear } from "./year_parser.js"
import { detectPart } from "./part_parser.js"
import { getFitment } from "./fitment_engine.js"
import { searchProducts } from "./product_search.js"

export async function processMessage(message) {

  const vehicle = detectVehicle(message)
  const year = detectYear(message)
  const part = detectPart(message)

  if (!vehicle && !part) {
    return "Please tell us the vehicle and auto part you need."
  }

  const fitment = getFitment(vehicle, year, part)

  // Vehicle-aware search query
  const searchQuery = vehicle
    ? `${vehicle} ${part || ""}`
    : part || message

  const products = await searchProducts(searchQuery)

  let response = ""

  if (vehicle && year) {
    response += `Vehicle: ${vehicle} ${year}\n\n`
  }

  if (fitment && part) {

    response += `Correct ${part} specification:\n`

    for (const key in fitment) {
      response += `${key}: ${fitment[key]}"\n`
    }

    response += "\n"
  }

  if (!products || products.length === 0) {
    response += "No matching products found."
    return response
  }

  response += "Available products:\n\n"

  products.forEach((p, i) => {
    response += `${i + 1}. ${p.title}\n`
  })

  return response
}
