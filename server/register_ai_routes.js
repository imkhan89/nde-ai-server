import aiRoutes from "../routes/ai_routes.js";

export function registerAIRoutes(app) {
  app.use("/api/ai", aiRoutes);
}

export default {
  registerAIRoutes
};
