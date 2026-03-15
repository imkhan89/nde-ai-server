/*
NDE Automotive AI
Rate Limiter Middleware

Protects API endpoints from abuse by limiting requests per IP.
*/

const REQUEST_LOG = new Map();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 120;    // 120 requests per minute per IP

function now() {
  return Date.now();
}

export function rateLimiter(req, res, next) {

  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket?.remoteAddress ||
    "unknown";

  const currentTime = now();

  if (!REQUEST_LOG.has(ip)) {

    REQUEST_LOG.set(ip, []);

  }

  const timestamps = REQUEST_LOG.get(ip);

  /*
  Remove expired timestamps
  */

  const validTimestamps = timestamps.filter(
    ts => currentTime - ts < WINDOW_MS
  );

  validTimestamps.push(currentTime);

  REQUEST_LOG.set(ip, validTimestamps);

  if (validTimestamps.length > MAX_REQUESTS) {

    return res.status(429).json({
      success: false,
      message: "Too many requests"
    });

  }

  next();

}
