import systemRoutes from "../routes/system_routes.js";

export function registerSystemRoutes(app) {
  app.use("/api/system", systemRoutes);
}

export default {
  registerSystemRoutes
};
