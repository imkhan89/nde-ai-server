import express from "express"
import cors from "cors"
import helmet from "helmet"
import http from "http"

import whatsappWebhook from "../routes/whatsapp_webhook.js"

export default function createHttpServer() {

  const app = express()

  app.use(helmet())

  app.use(cors())

  /* VERY IMPORTANT FOR TWILIO */
  app.use(express.urlencoded({ extended: true }))

  app.use(express.json())

  app.get("/", (req, res) => {
    res.json({
      status: "running",
      service: "nde-ai-server"
    })
  })

  app.use("/webhook", whatsappWebhook)

  const server = http.createServer(app)

  return server
}
