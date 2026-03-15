import express from "express"
import { processUserMessage } from "../services/ai_engine.js"

const router = express.Router()

router.post("/whatsapp", async (req, res) => {

  const message = req.body.Body || ""

  const reply = await processUserMessage(message)

  const twiml = `
<Response>
<Message>${reply}</Message>
</Response>
`

  res.type("text/xml")
  res.send(twiml)

})

export default router
