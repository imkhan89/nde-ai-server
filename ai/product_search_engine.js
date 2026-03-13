const localSearch = require("./local_product_search")

function searchProducts(query){

try{

const results = localSearch.searchProducts(query)

if(!results || results.length === 0){

return {
success:false,
message:"No matching products found"
}

}

return {
success:true,
products:results
}

}catch(err){

console.log("Search engine error:",err.message)

return {
success:false,
message:"Search error"
}

}

}

module.exports = {
searchProducts
}
