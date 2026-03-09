/* =====================================================
SHOPIFY SEARCH ENGINE
Builds ndestore Shopify search URLs safely
===================================================== */

function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

/* =====================================================
GENERATE SHOPIFY SEARCH URL
===================================================== */

function generateSearch(input){

let query=""

/* Accept string or object */

if(typeof input === "string"){

query = normalize(input)

}
else if(typeof input === "object" && input.query){

query = normalize(input.query)

}

/* Fallback */

if(!query){

return "https://www.ndestore.com/search"

}

/* Encode safely */

const encoded = encodeURIComponent(query)

/* Force product search */

return `https://www.ndestore.com/search?q=${encoded}&type=product`

}

module.exports = {

generateSearch

}
