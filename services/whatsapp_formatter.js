export function formatWhatsappText(product) {

  if (!product) return "Product not found."

  const title = product.title || ""
  const price = product.variants?.[0]?.price || ""
  const url = `https://ndestore.com/products/${product.handle}`

  return `${title}

PKR ${price}

${url}`

}
