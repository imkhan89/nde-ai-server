function createStickerOrder(data){

const order={

customer:data.customer || "",
image:data.image || "",
size:data.size || "",
time:new Date().toISOString()

}

return order

}

module.exports={createStickerOrder}
