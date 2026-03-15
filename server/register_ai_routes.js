import aiRoutes from "../routes/ai_routes.js";

/*
NDE Automotive AI
AI Route Registration
*/

export function registerAIRoutes(app) {

  if (!app) {
    throw new Error("Express app instance required");
  }

  /*
  Register AI routes
  */

  app.use("/api", aiRoutes);

}
