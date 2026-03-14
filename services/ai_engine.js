import { detectVehicle } from "./vehicle_parser.js"
import { detectYear } from "./year_parser.js"
import { detectPart } from "./part_parser.js"
import { searchProducts } from "./product_search.js"
import { getFitment } from "./fitment_engine.js"

export async function processMessage(message) {

  const vehicle = detectVehicle(message)
  const year = detectYear(message)
  const part = detectPart(message)

  if (!part) {
    return "Please tell us which auto part you need."
  }

  const fitment = getFitment(vehicle, year, part)

  const products = await searchProducts(part)

  let response = ""

  if (vehicle && year) {
    response += `Vehicle: ${vehicle} ${year}\n\n`
  }

  if (fitment) {

    response += `Correct ${part} specification:\n`

    for (const key in fitment) {
      response += `${key}: ${fitment[key]}"\n`
    }

    response += "\n"
  }

  response += "Available products:\n\n"

  products.forEach((p, i) => {
    response += `${i + 1}. ${p.title}\n`
  })

  return response
}
