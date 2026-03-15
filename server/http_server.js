import express from "express"
import cors from "cors"
import helmet from "helmet"
import http from "http"

export default function createHttpServer() {

  const app = express()

  app.use(helmet())

  app.use(cors({
    origin: "*",
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"]
  }))

  app.use(express.json({ limit: "10mb" }))
  app.use(express.urlencoded({ extended: true }))

  app.get("/", (req,res)=>{
    res.json({
      status:"running",
      app:"NDE Automotive AI",
      version:"1.0"
    })
  })

  app.get("/health",(req,res)=>{
    res.json({
      status:"ok",
      uptime:process.uptime()
    })
  })

  app.post("/chat", async (req,res)=>{
    try{

      const { message } = req.body

      if(!message){
        return res.status(400).json({
          error:"message required"
        })
      }

      const reply = `AI received: ${message}`

      res.json({
        success:true,
        reply
      })

    }catch(err){

      console.error(err)

      res.status(500).json({
        error:"server error"
      })

    }
  })

  const server = http.createServer(app)

  return server
}
