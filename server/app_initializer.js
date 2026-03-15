import express from "express";

import { requestLogger } from "../middleware/request_logger.js";
import { rateLimiter } from "../middleware/rate_limiter.js";
import { securityHeaders } from "../middleware/security_headers.js";
import { corsMiddleware } from "../middleware/cors_middleware.js";
import { jsonParser } from "../middleware/json_parser.js";
import { notFoundHandler } from "../middleware/not_found_handler.js";
import { globalErrorMiddleware } from "../middleware/global_error_middleware.js";

/*
NDE Automotive AI
Express App Initializer
*/

export function createApp() {

  const app = express();

  /*
  Core middleware
  */

  app.use(securityHeaders);

  app.use(corsMiddleware);

  app.use(rateLimiter);

  app.use(requestLogger);

  app.use(jsonParser);

  /*
  Not found + global error handlers
  */

  app.use(notFoundHandler);

  app.use(globalErrorMiddleware);

  return app;

}
