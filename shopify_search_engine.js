/* =====================================================
SHOPIFY SEARCH ENGINE
Builds Shopify search URLs exactly like store search
===================================================== */


/* =====================================================
NORMALIZE
===================================================== */

function normalize(text){

return (text || "")
.toString()
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

/* convert spaces to + for URL */

return normalized.split(" ").join("+")

}


/* =====================================================
GENERATE SEARCH URL
===================================================== */

function generateSearch(input){

let query = ""

if(typeof input === "string"){

query = input

}

else if(typeof input === "object" && input.query){

query = input.query

}

/* normalize query */

query = normalize(query)

if(!query){

return "https://www.ndestore.com/search"

}

const formatted = buildQuery(query)

return `https://www.ndestore.com/search?q=${formatted}`

}


/* =====================================================
EXPORT
===================================================== */

module.exports = {

generateSearch

}
