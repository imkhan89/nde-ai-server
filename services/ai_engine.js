import { normalizeText } from "../utils/helpers.js"
import { correctSpelling } from "./spelling_corrector.js"
import { detectVehicle } from "./vehicle_parser.js"
import { detectPart } from "./part_parser.js"
import { searchProduct } from "./product_search.js"

export async function processMessage(db, phone, message){

try{

let text = normalizeText(message)

text = correctSpelling(text)

const vehicle = detectVehicle(text)
const part = detectPart(text)

if(!part){

return `Send request in format:

Part + Make + Model + Year

Example:
corolla 2016 wiper`
}

const product = await searchProduct(db,part)

if(!product){

return `Product not found.

Our team will contact you shortly.`

}

return `${product.title}

Price: ${product.price}

https://ndestore.com/products/${product.handle}`

}catch(error){

console.error("AI error:", error)

return "System error. Please try again."

}

}
