import http from "http";
import { bootstrapServer } from "./server_bootstrap.js";

/*
NDE Automotive AI
HTTP Server Launcher
*/

export async function startHttpServer() {

  const app = await bootstrapServer();

  const PORT = process.env.PORT || 3000;

  const server = http.createServer(app);

  server.listen(PORT, () => {

    console.log(`NDE Automotive AI Server running on port ${PORT}`);

  });

  server.on("error", (err) => {

    console.error("Server error:", err);

  });

}
