/* =====================================================
SHOPIFY SEARCH ENGINE
Builds Shopify search URLs exactly like store search
===================================================== */

/* =====================================================
NORMALIZE
===================================================== */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

/* =====================================================
BUILD SEARCH QUERY
===================================================== */

function buildQuery(text){

const normalized = normalize(text)

if(!normalized){
return ""
}

/* convert spaces to + */

return normalized.split(" ").join("+")

}

/* =====================================================
GENERATE SEARCH URL
===================================================== */

function generateSearch(input){

let query=""

if(typeof input === "string"){

query = input

}

else if(typeof input === "object" && input.query){

query = input.query

}

const formatted = buildQuery(query)

if(!formatted){

return "https://www.ndestore.com/search"

}

return `https://www.ndestore.com/search?q=${formatted}`

}

/* =====================================================
EXPORT
===================================================== */

module.exports = {

generateSearch

}
