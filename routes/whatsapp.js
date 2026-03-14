import { MessagingResponse } from "twilio/lib/twiml/MessagingResponse.js"

export function whatsappRoute(app, handler){

app.post("/whatsapp", async (req,res)=>{

const phone = req.body.From
const message = req.body.Body

const reply = await handler(phone,message)

const twiml = new MessagingResponse()

twiml.message(reply)

res.type("text/xml")

res.send(twiml.toString())

})

}
