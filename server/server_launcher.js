import { createHTTPServer } from "./http_server.js";

export function launchServer() {
  const app = createHTTPServer();

  const PORT = process.env.PORT || 3000;

  const server = app.listen(PORT, () => {
    console.log(`NDE Automotive AI Server running on port ${PORT}`);
  });

  return server;
}

export default {
  launchServer
};
