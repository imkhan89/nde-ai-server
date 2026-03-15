export function mapProduct(product) {

  if (!product) return null

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    price: product?.variants?.[0]?.price || null
  }

}
