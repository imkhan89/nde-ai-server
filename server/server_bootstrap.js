import { createApp } from "./app_initializer.js";
import { registerRoutes } from "./register_routes.js";
import { registerAIRoutes } from "./register_ai_routes.js";
import { registerSyncRoutes } from "./register_sync_routes.js";
import { registerSystemRoutes } from "./register_system_routes.js";

import { startServices } from "./start_services.js";
import { startScheduler } from "../services/scheduler.js";
import { loadConfig } from "../services/config_manager.js";

/*
NDE Automotive AI
Server Bootstrap
*/

export async function bootstrapServer() {

  loadConfig();

  const app = createApp();

  /*
  Register routes
  */

  registerRoutes(app);
  registerAIRoutes(app);
  registerSyncRoutes(app);
  registerSystemRoutes(app);

  /*
  Start background services
  */

  await startServices();

  startScheduler();

  return app;

}
