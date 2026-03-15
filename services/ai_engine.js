import { searchProduct } from "./product_search.js"

export async function processUserMessage(message) {

  if (!message) {
    return "Please send a message."
  }

  const text = message.toLowerCase().trim()

  /* greeting detection */

  if (
    text === "hi" ||
    text === "hello" ||
    text === "hey" ||
    text.includes("assalam")
  ) {
    return `Hello 👋

Welcome to NDE Store.

You can ask about:

• Car parts
• Filters
• Brake pads
• Wiper blades
• Any vehicle parts

Example:
Honda Civic 2018 air filter`
  }

  /* product search */

  const results = searchProduct(text)

  if (!results || results.length === 0) {
    return `I couldn't find that product.

Please try something like:

• Civic 2018 air filter
• Corolla brake pads
• Honda City wiper blades`
  }

  const product = results[0]

  const title = product.title || "Product"
  const handle = product.handle || ""

  let price = ""

  if (product.variants && product.variants.length > 0) {
    price = `PKR ${product.variants[0].price}`
  }

  const url = `https://ndestore.com/products/${handle}`

  return `${title}

${price}

${url}`
}
