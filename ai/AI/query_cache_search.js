/* =====================================================
CACHED PRODUCT SEARCH
===================================================== */

const { searchProducts } = require("./product_search_engine")

const { getCachedResult, setCachedResult } = require("./search_cache")


function cachedSearch(query){

const cached = getCachedResult(query)

if(cached){

return cached

}

const results = searchProducts(query)

setCachedResult(query, results)

return results

}


module.exports = {

cachedSearch

}
