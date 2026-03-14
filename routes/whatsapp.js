import { MessagingResponse } from "twilio/lib/twiml/MessagingResponse.js"

export async function whatsappRoute(req,res,handler){

const incoming = req.body.Body
const phone = req.body.From

const reply = await handler(phone,incoming)

const twiml = new MessagingResponse()

twiml.message(reply)

res.type("text/xml")

res.send(twiml.toString())

}
