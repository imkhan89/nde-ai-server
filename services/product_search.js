export async function searchProduct(db,part){

const products = await db.all(
"SELECT * FROM products WHERE title LIKE ?",
[`%${part}%`]
)

if(!products || products.length === 0){
return null
}

return products[0]

}
