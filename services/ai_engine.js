import { normalizeQuery } from "./query_normalizer.js"
import { detectVehicle } from "./vehicle_parser.js"
import { detectYear } from "./year_parser.js"
import { detectProductName } from "./product_name_parser.js"
import { detectMake } from "./make_detector.js"
import { detectGeneration } from "./generation_detector.js"
import { getFitment } from "./fitment_engine.js"
import { searchProducts } from "./product_search.js"

export async function processMessage(message) {

  // Normalize user message (fix typos)
  const normalizedMessage = normalizeQuery(message)

  // Extract automotive entities
  const model = detectVehicle(normalizedMessage)
  const year = detectYear(normalizedMessage)
  const product = detectProductName(normalizedMessage)
  const make = detectMake(model)

  const generation = detectGeneration(model, year)

  if (!model && !product) {
    return "Please tell us the vehicle and auto part you need."
  }

  const fitment = getFitment(model, year, product)

  let products = []

  // Intelligent search strategy

  // 1. Vehicle + product
  if (model && product) {
    products = await searchProducts(`${model} ${product}`)
  }

  // 2. Product only
  if (products.length === 0 && product) {
    products = await searchProducts(product)
  }

  // 3. Full query fallback
  if (products.length === 0) {
    products = await searchProducts(normalizedMessage)
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
