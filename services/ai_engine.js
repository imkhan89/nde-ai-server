import { detectVehicle } from "./vehicle_parser.js"
import { detectYear } from "./year_parser.js"
import { detectPart } from "./part_parser.js"
import { getFitment } from "./fitment_engine.js"
import { searchProducts } from "./product_search.js"

export async function processMessage(message) {

  const vehicleModel = detectVehicle(message)
  const year = detectYear(message)
  const part = detectPart(message)

  // Detect make based on model
  let make = null

  const toyotaModels = [
    "corolla",
    "yaris",
    "hilux",
    "vigo",
    "revo",
    "fortuner",
    "prado"
  ]

  const hondaModels = [
    "civic",
    "city"
  ]

  if (toyotaModels.includes(vehicleModel)) {
    make = "Toyota"
  }

  if (hondaModels.includes(vehicleModel)) {
    make = "Honda"
  }

  if (!vehicleModel && !part) {
    return "Please tell us the vehicle and auto part you need."
  }

  const fitment = getFitment(vehicleModel, year, part)

  // Intelligent search query
  const searchQuery = vehicleModel
    ? `${vehicleModel} ${part || ""}`
    : part || message

  const products = await searchProducts(searchQuery)

  let response = ""

  if (make || vehicleModel || year) {

    response += `Vehicle Details:\n`

    if (make) {
      response += `Make: ${make}\n`
    }

    if (vehicleModel) {
      response += `Model: ${vehicleModel}\n`
    }

    if (year) {
      response += `Year: ${year}\n`
    }

    response += "\n"
  }

  if (part) {
    response += `Product Requested: ${part}\n\n`
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
    response += `${i + 1}. ${p.tit
