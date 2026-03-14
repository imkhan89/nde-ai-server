export function rankProducts(products){

return products.sort((a,b)=>{

if(a.price < b.price) return -1
if(a.price > b.price) return 1

return 0

})

}
