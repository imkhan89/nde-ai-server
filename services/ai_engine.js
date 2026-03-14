import { normalizeText } from "../utils/helpers.js"
import { correctSpelling } from "./spelling_corrector.js"
import { detectVehicle } from "./vehicle_parser.js"
import { detectPart } from "./part_parser.js"
import { searchProduct } from "./product_search.js"
import { detectCountry } from "./country_detector.js"
import { convert } from "./currency_converter.js"
import { saveLead } from "../database/queries.js"
import { getContext, setContext } from "./conversation_memory.js"

export async function processMessage(db, phone, message){

let text = normalizeText(message)

text = correctSpelling(text)

const country = detectCountry(phone)

let vehicle = detectVehicle(text)
let part = detectPart(text)

const context = await getContext(db, phone)

if(!vehicle && context.vehicle){
vehicle = context.vehicle
}

if(!part && context.part){
part = context.part
}

if(vehicle){
await setContext(db, phone, {vehicle})
}

if(part){
await setContext(db, phone, {part})
}

if(!part){

return `Please send request in format:

Part + Make + Model + Year

Example:
corolla 2016 wiper`
}

const product = await searchProduct(db, part)

if(!product){

await saveLead(db, phone, text)

return `We could not find this product.

Our team will contact you shortly.`
}

let price = product.price

if(country !== "Pakistan"){
price = convert(price,"USD")
}

return `${product.title}

Price: ${price}

Order here:
https://ndestore.com/products/${product.handle}`
}
