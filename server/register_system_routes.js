import systemRoutes from "../routes/system_routes.js";

/*
NDE Automotive AI
System Route Registration
*/

export function registerSystemRoutes(app) {

  if (!app) {
    throw new Error("Express app instance required");
  }

  /*
  Register System routes
  */

  app.use("/api", systemRoutes);

}
