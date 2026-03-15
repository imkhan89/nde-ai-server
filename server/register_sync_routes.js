import syncRoutes from "../routes/sync_routes.js";

export function registerSyncRoutes(app) {
  app.use("/api/sync", syncRoutes);
}

export default {
  registerSyncRoutes
};
