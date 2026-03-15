/*
NDE Automotive AI
Global Error Handler

Handles and formats system errors safely.
Prevents crashes and ensures stable responses.
*/

export function handleError(error, context = "") {

  const message = error?.message || "Unknown error";

  console.error(`[AI ERROR] ${context}`, error);

  return {
    success: false,
    error: {
      message,
      context
    }
  };

}

export function asyncHandler(fn) {

  return async function wrapped(req, res, next) {

    try {

      await fn(req, res, next);

    } catch (error) {

      const response = handleError(error, req?.path || "unknown");

      res.status(500).json(response);

    }

  };

}
