const {analyzeAutomotiveQuery}=require("./automotive_ai_engine")
const {searchProducts}=require("./product_search_engine")
const {buildShopifySearch}=require("./shopify_search_engine")

function mainMenu(){

return `Welcome to NDESTORE.COM

Select one option

1 Auto Parts
2 Accessories
3 Decal Stickers
4 Order Status
5 Chat Support
6 Complaints
`

}

function processAutoParts(message){

const analysis=analyzeAutomotiveQuery(message)

const results=searchProducts(analysis.query)

const url=buildShopifySearch(analysis.query)

return{

analysis,
results,
url

}

}

module.exports={

mainMenu,
processAutoParts

}
