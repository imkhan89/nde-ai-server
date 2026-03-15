import express from "express";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "nde-automotive-ai",
    timestamp: new Date().toISOString()
  });
});

router.get("/info", (req, res) => {
  res.json({
    name: "NDE Automotive AI",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

router.get("/metrics", (req, res) => {
  res.json({
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    uptime: process.uptime()
  });
});

export default router;
