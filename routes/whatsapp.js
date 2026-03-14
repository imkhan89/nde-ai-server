import pkg from "twilio"

const { twiml } = pkg
const MessagingResponse = twiml.MessagingResponse

export function whatsappRoute(app, handler){

app.post("/whatsapp", async (req,res)=>{

try{

const phone = req.body?.From || "unknown"
const message = req.body?.Body || ""

console.log("Incoming:", phone, message)

const reply = await handler(phone,message)

const response = new MessagingResponse()

response.message(reply || "OK")

res.type("text/xml")

res.send(response.toString())

}catch(error){

console.error("Webhook error:", error)

const response = new MessagingResponse()

response.message("System temporarily unavailable.")

res.type("text/xml")

res.send(response.toString())

}

})

}
