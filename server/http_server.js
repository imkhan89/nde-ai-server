import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";

export default function createHttpServer() {

  const app = express();

  /* -----------------------------
     Security
  ----------------------------- */
  app.use(helmet());

  /* -----------------------------
     CORS
  ----------------------------- */
  app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  }));

  /* -----------------------------
     Body Parser
  ----------------------------- */
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  /* -----------------------------
     Health Check
  ----------------------------- */
  app.get("/", (req, res) => {
    res.json({
      status: "running",
      service: "NDE Automotive AI Server",
      version: "1.0"
    });
  });

  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      uptime: process.uptime()
    });
  });

  /* -----------------------------
     Chat Endpoint
  ----------------------------- */
  app.post("/chat", async (req, res) => {

    try {

      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          error: "Message required"
        });
      }

      // placeholder AI response
      const reply = `AI received: ${message}`;

      res.json({
        success: true,
        reply
      });

    } catch (error) {

      console.error("Chat Error:", error);

      res.status(500).json({
        error: "Internal server error"
      });

    }

  });

  /* -----------------------------
     Create HTTP Server
  ----------------------------- */
  const server = http.createServer(app);

  return server;
}
