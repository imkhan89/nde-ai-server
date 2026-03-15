import { searchProducts } from "../sync/shopify_sync.js"

export async function processUserMessage(message) {

  if (!message) {
    return "Please send a message."
  }

  const query = message.toLowerCase()

  const results = searchProducts(query)

  if (!results || results.length === 0) {
    return "Sorry, I couldn't find a matching product."
  }

  const product = results[0]

  return formatProduct(product)
}

function formatProduct(product) {

  const title = product.title || "Product"
  const handle = product.handle || ""
  const url = `https://ndestore.com/products/${handle}`

  let price = "Price not available"

  if (product.variants && product.variants.length > 0) {
    price = `PKR ${product.variants[0].price}`
  }

  return `
${title}

${price}

View Product:
${url}
`
}
