const { searchProducts } = require("./product_search_engine")

function recommendProducts(query){

let recommendations=[]

try{

const results = searchProducts(query)

if(results && results.length){

for(let i=0;i<results.length && i<3;i++){

recommendations.push({

title:results[i].title,
price:results[i].price,
url:`https://www.ndestore.com/products/${results[i].handle}`

})

}

}

}catch(e){

console.log("Recommendation error")

}

return recommendations

}

module.exports={recommendProducts}
