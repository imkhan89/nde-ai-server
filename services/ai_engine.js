import { detectVehicle } from "./vehicle_parser.js"
import { detectYear } from "./year_parser.js"
import { detectProductName } from "./product_name_parser.js"
import { detectMake } from "./make_detector.js"
import { getFitment } from "./fitment_engine.js"
import { searchProducts } from "./product_search.js"

export async function processMessage(message) {

  const model = detectVehicle(message)
  const year = detectYear(message)
  const product = detectProductName(message)

  const make = detectMake(model)

  if (!model && !product) {
    return "Please tell us the vehicle and auto part you need."
  }

  const fitment = getFitment(model, year, product)

  const searchQuery = model
    ? `${model} ${product || ""}`
    : product || message

  const products = await searchProducts(searchQuery)

  let response = ""

  response += `Vehicle Identification:\n`

  if (make) {
    response += `Make: ${make}\n`
  }

  if (model) {
    response += `Model: ${model}\n`
  }

  if (year) {
    response += `Year: ${year}\n`
  }

  response += "\n"

  if (product) {
    response += `Product Requested: ${product}\n\n`
  }

  if (fitment && product) {

    response += `Correct ${product} specification:\n`

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
