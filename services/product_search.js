export async function searchProduct(db,part){

const product = await db.get(
"SELECT * FROM products WHERE title LIKE ? LIMIT 1",
[`%${part}%`]
)

return product

}
