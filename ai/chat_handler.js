const productSearch = require("./product_search_engine")

async function handleMessage(message){

try{

const text = message.toLowerCase().trim()

const search = productSearch.searchProducts(text)

if(search.success){

let reply = "Here are matching products:\n\n"

search.products.forEach((product,index)=>{

reply += `${index+1}. ${product.title}\n${product.url}\n\n`

})

return reply

}

return "Sorry, no matching products found."

}catch(err){

console.log("Chat handler error:",err.message)

return "System error. Please try again."

}

}

module.exports = {
handleMessage
}
