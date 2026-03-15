import http from "http";
import app from "./server/http_server.js";
import { syncShopifyProducts } from "./sync/shopify_sync.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await syncShopifyProducts();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`ndestore.com Automotive AI running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
  }
}

startServer();
