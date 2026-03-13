const axios = require("axios")

const SHOP = "ndestore.com"
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN

async function getOrder(orderNumber){

try{

const response = await axios.get(
`https://${SHOP}/admin/api/2023-10/orders.json?name=${orderNumber}`,
{
headers:{
"X-Shopify-Access-Token":TOKEN
}
}
)

const orders = response.data.orders

if(!orders || orders.length === 0){
return null
}

const order = orders[0]

return {
name:order.name,
status:order.fulfillment_status || "Processing",
financial:order.financial_status,
tracking:order.tracking_numbers
}

}catch(err){

console.log("Shopify order error:",err.message)
return null

}

}

module.exports = {
getOrder
}
