/*
NDE Automotive AI
Request Logger Middleware

Logs incoming API requests for monitoring and debugging.
*/

export function requestLogger(req, res, next) {

  const start = Date.now();

  const { method, originalUrl } = req;

  res.on("finish", () => {

    const duration = Date.now() - start;

    console.log(
      `[REQUEST] ${method} ${originalUrl} ${res.statusCode} ${duration}ms`
    );

  });

  next();

}
