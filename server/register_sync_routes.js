import syncRoutes from "../routes/sync_routes.js";

/*
NDE Automotive AI
Sync Route Registration
Registers Shopify sync endpoints.
*/

export function registerSyncRoutes(app) {

  if (!app) {
    throw new Error("Express app instance required");
  }

  /*
  Register Sync routes
  */

  app.use("/api", syncRoutes);

}
