import express from "express"
import { processUserMessage } from "../services/ai_engine.js"

const router = express.Router()

router.post("/", async (req, res) => {

  try {

    const { message } = req.body

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required"
      })
    }

    const reply = await processUserMessage(message)

    res.json({
      success: true,
      reply
    })

  } catch (error) {

    console.error("Chat Route Error:", error)

    res.status(500).json({
      success: false,
      error: "Server error"
    })

  }

})

export default router
