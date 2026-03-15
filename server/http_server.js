import express from "express"
import cors from "cors"
import helmet from "helmet"
import http from "http"

import whatsappWebhook from "../routes/whatsapp_webhook.js"
import chatRoute from "../routes/chat_route.js"
import healthRoute from "../routes/health_route.js"
import productRoute from "../routes/product_route.js"

import errorHandler from "../middleware/error_handler.js"
import notFound from "../middleware/not_found.js"

export default function createHttpServer() {

  const app = express()

  /* security */
  app.use(helmet())

  /* cors */
  app.use(cors({
    origin: "*",
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"]
  }))

  /* body parsing */
  app.use(express.json({ limit: "10mb" }))
  app.use(express.urlencoded({ extended: true }))

  /* routes */
  app.use("/webhook", whatsappWebhook)
  app.use("/chat", chatRoute)
  app.use("/health", healthRoute)
  app.use("/products", productRoute)

  /* root */
  app.get("/", (req,res)=>{
    res.json({
      status:"running",
      service:"nde-ai-server",
      version:"1.0"
    })
  })

  /* 404 handler */
  app.use(notFound)

  /* error handler */
  app.use(errorHandler)

  const server = http.createServer(app)

  return server
}
