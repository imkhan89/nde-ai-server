/* =====================================================
CHAT RESPONSE BUILDER
Formats AI search results into customer reply
===================================================== */

function buildProductMessage(products){

if(!products || products.length === 0){

return "I could not find an exact match. Please send your car model and year so I can help you better."

}

let message = "I found compatible parts:\n\n"

let count = 1

for(const product of products){

message += count + "️⃣ " + product.title + "\n"
message += product.url + "\n\n"

count++

}

return message

}


/* =====================================================
MAIN RESPONSE BUILDER
===================================================== */

function buildChatResponse(aiResult){

if(!aiResult){

return "Please send the vehicle details so I can help you."

}

const products = aiResult.products || []

const productMessage = buildProductMessage(products)

return productMessage

}


/* =====================================================
EXPORT
===================================================== */

module.exports = {

buildChatResponse

}
