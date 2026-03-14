import pkg from "twilio"

const { twiml } = pkg
const MessagingResponse = twiml.MessagingResponse

export function whatsappRoute(app, handler){

app.post("/whatsapp", async (req,res)=>{

const phone = req.body.From
const message = req.body.Body

const reply = await handler(phone,message)

const response = new MessagingResponse()

response.message(reply)

res.type("text/xml")

res.send(response.toString())

})

}
