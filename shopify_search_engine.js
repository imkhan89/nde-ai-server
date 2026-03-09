// shopify_search_engine.js

/* =====================================================
SHOPIFY SEARCH ENGINE
Builds ndestore Shopify search URLs safely
===================================================== */

/* =====================================================
NORMALIZE QUERY
===================================================== */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

/* =====================================================
BUILD SHOPIFY SEARCH
===================================================== */

function generateSearch(input){

let query = ""

/* Accept object or string */

if(typeof input === "string"){

query = normalize(input)

}else if(typeof input === "object" && input.query){

query = normalize(input.query)

}

/* Prevent empty query */

if(!query){
return "https://www.ndestore.com/search"
}

/* Encode query safely */

const encodedQuery = encodeURIComponent(query)

/* Build URL */

return `https://www.ndestore.com/search?q=${encodedQuery}`

}

/* =====================================================
EXPORT
===================================================== */

module.exports = {

generateSearch

}
