import http from "http";
import app from "./server/http_server.js";
import { syncShopifyProducts } from "./sync/shopify_sync.js";

const PORT = process.env.PORT || 8080;

async function startServer() {

  try {

    console.log("Starting Shopify sync...");

    await syncShopifyProducts();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`ndestore.com Automotive AI running on port ${PORT}`);
    });

    // Auto sync every 30 minutes
    setInterval(async () => {

      console.log("Running scheduled Shopify sync...");

      await syncShopifyProducts();

    }, 30 * 60 * 1000);

  } catch (error) {

    console.error("Server startup error:", error);

  }
}

startServer();
