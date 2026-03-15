import express from "express"
import { processUserMessage } from "../services/ai_engine.js"

const router = express.Router()

router.post("/whatsapp", async (req, res) => {

  try {

    const incomingMsg = req.body.Body || ""

    const reply = await processUserMessage(incomingMsg)

    const twiml = `
<Response>
<Message>${reply}</Message>
</Response>
`

    res.set("Content-Type", "text/xml")
    res.send(twiml)

  } catch (error) {

    console.error("WhatsApp Webhook Error:", error)

    res.set("Content-Type", "text/xml")
    res.send(`
<Response>
<Message>Server error. Please try again.</Message>
</Response>
`)
  }

})

export default router
