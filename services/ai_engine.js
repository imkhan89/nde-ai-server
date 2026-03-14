import { detectVehicle } from "./vehicle_parser.js"
import { detectYear } from "./year_parser.js"
import { detectProductName } from "./product_name_parser.js"
import { detectMake } from "./make_detector.js"
import { detectGeneration } from "./generation_detector.js"
import { getFitment } from "./fitment_engine.js"
import { searchProducts } from "./product_search.js"

export async function processMessage(message) {

  const model = detectVehicle(message)
  const year = detectYear(message)
  const product = detectProductName(message)
  const make = detectMake(model)

  const generation = detectGeneration(model, year)

  if (!model && !product) {
    return "Please tell us the vehicle and auto part you need."
  }

  const fitment = getFitment(model, year, product)

  let products = []

  // Intelligent search strategy

  // 1. vehicle + product
  if (model && product) {
    products = await searchProducts(`${model} ${product}`)
  }

  // 2. product only
  if (products.length === 0 && product) {
    products = await searchProducts(product)
  }

  // 3. full message fallback
  if (products.length === 0) {
    products = await searchProducts(message)
  }

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

  if (generation) {
    response += `Generation Range: ${generation.generationStart}-${generation.generationEnd}\n`
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
