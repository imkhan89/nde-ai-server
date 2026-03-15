export function formatProductResponse(product) {

  if (!product) {
    return "Product not found."
  }

  const title = product.title || "Product"
  const handle = product.handle || ""

  let price = "Price unavailable"

  if (product.variants && product.variants.length > 0) {
    price = `PKR ${product.variants[0].price}`
  }

  const productUrl = `https://ndestore.com/products/${handle}`

  let image = ""
  if (product.images && product.images.length > 0) {
    image = product.images[0].src
  }

  return {
    title,
    price,
    url: productUrl,
    image
  }
}
