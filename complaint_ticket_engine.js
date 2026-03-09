function generateTicket(orderNumber){

const d=new Date()

const yy=String(d.getFullYear()).slice(-2)
const mm=String(d.getMonth()+1).padStart(2,"0")
const dd=String(d.getDate()).padStart(2,"0")

return `C-${orderNumber}-${yy}/${mm}/${dd}`

}

module.exports={generateTicket}
