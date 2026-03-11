/* =====================================================
CHAT HANDLER
Main entry point for customer messages
===================================================== */

const { analyzeAutomotiveQuery } = require("./automotive_ai_engine")
const { buildChatResponse } = require("./response_builder")
const { cachedSearch } = require("./query_cache_search")
const { buildSearchQuery } = require("./search_query_builder")


async function handleCustomerMessage(message){

if(!message){

return "Please send the vehicle and part details."

}


/* =====================================================
ANALYZE CUSTOMER QUERY
===================================================== */

const aiResult = analyzeAutomotiveQuery(message)


/* =====================================================
BUILD SEARCH QUERY
===================================================== */

const searchQuery = buildSearchQuery(aiResult)


/* =====================================================
SEARCH PRODUCTS (CACHED)
===================================================== */

let products = []

try{

products = cachedSearch(searchQuery)

}catch(err){

products = []

}


/* =====================================================
ATTACH PRODUCTS TO AI RESULT
===================================================== */

aiResult.products = products


/* =====================================================
BUILD FINAL RESPONSE
===================================================== */

const response = buildChatResponse(aiResult)

return response

}


module.exports = {

handleCustomerMessage

}
