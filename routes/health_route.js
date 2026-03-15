import express from "express";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ndestore.com Automotive AI",
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

export default router;
