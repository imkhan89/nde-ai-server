/*
NDE Automotive AI
Not Found Handler

Handles unknown API routes.
*/

export function notFoundHandler(req, res) {

  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.originalUrl || ""
  });

}
