import express from "express";
import cors from "cors";
import helmet from "helmet";

import { registerAIRoutes } from "./register_ai_routes.js";
import { registerSyncRoutes } from "./register_sync_routes.js";
import { registerSystemRoutes } from "./register_system_routes.js";

export function createHTTPServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(helmet());

  app.get("/", (req, res) => {
    res.json({
      service: "NDE Automotive AI",
      status: "running"
    });
  });

  registerAIRoutes(app);
  registerSyncRoutes(app);
  registerSystemRoutes(app);

  return app;
}

export default {
  createHTTPServer
};
