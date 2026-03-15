/*
NDE Automotive AI
Global Error Middleware

Captures all unhandled errors in Express.
*/

export function globalErrorMiddleware(err, req, res, next) {

  console.error("[GLOBAL ERROR]", err);

  res.status(500).json({
    success: false,
    message: err?.message || "Internal server error",
    path: req?.originalUrl || ""
  });

}
