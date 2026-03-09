function buildShopifySearch(query){

const base="https://www.ndestore.com/search?q="

const safe=query
.toLowerCase()
.replace(/\s+/g,"+")

return base+safe

}

module.exports={buildShopifySearch}
