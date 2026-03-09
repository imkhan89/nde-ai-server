function handleKnowledge(query){

const q=query.toLowerCase()

if(q.includes("shipping")){

return "Shipping information is available at https://www.ndestore.com/pages/shipping"

}

if(q.includes("return")){

return "Return policy https://www.ndestore.com/pages/returns"

}

if(q.includes("refund")){

return "Refund policy https://www.ndestore.com/pages/refund-policy"

}

return null

}

module.exports={handleKnowledge}
