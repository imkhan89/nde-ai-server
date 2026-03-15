import searchRoutes from "../routes/search_routes.js";

/*
NDE Automotive AI
Route Registration Layer
Auto-registers all API routes
*/

export function registerRoutes(app) {

  if (!app) {
    throw new Error("Express app instance required");
  }

  /*
  Core AI Search
  */

  app.use("/api", searchRoutes);

  /*
  Root endpoint
  */

  app.get("/", (req, res) => {

    res.json({
      service: "NDE Automotive AI",
      status: "running",
      version: "1.0",
      endpoints: [
        "/api/search?q=product",
        "/api/search/health"
      ]
    });

  });

}
