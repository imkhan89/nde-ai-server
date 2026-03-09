const axios=require("axios")

async function convertPKRtoUSD(amount){

try{

const res=await axios.get("https://open.er-api.com/v6/latest/PKR")

const rate=res.data.rates.USD

const usd=(amount*rate).toFixed(2)

return usd

}catch(e){

return null

}

}

module.exports={convertPKRtoUSD}
