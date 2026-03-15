import { searchProduct } from "./product_search.js"

const BRAND_NAME = "ndestore.com"
const WEBSITE = "https://www.ndestore.com"

export async function processUserMessage(message) {

  if (!message) {
    return `Welcome to ${BRAND_NAME}.
Please send your query.`
  }

  const text = message.toLowerCase().trim()

  /* greeting */

  if (
    text === "hi" ||
    text === "hello" ||
    text === "hey" ||
    text.includes("assalam")
  ) {
    return `Hello 👋

Welcome to ${BRAND_NAME}

We specialize in:

• Automotive spare parts
• Car accessories
• Decals & car care products

You can search like:

Corolla 2018 air filter
Civic brake pads
City wiper blades

Visit:
${WEBSITE}`
  }

  /* product search */

  const results = searchProduct(text)

  if (!results || results.length === 0) {
    return `Sorry, I couldn't find that product.

Try searching like:

• Civic 2018 air filter
• Corolla brake pads
• Honda City wiper blades

You can also browse:
${WEBSITE}`
  }

  const product = results[0]

  const title = product.title || "Product"
  const handle = product.handle || ""

  let price = ""

  if (product.variants && product.variants.length > 0) {
    price = `PKR ${product.variants[0].price}`
  }

  const url = `${WEBSITE}/products/${handle}`

  return `${title}

${price}

View product on ${BRAND_NAME}:
${url}`
}
