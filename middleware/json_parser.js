/*
NDE Automotive AI
JSON Parser Middleware

Safely parses JSON request bodies.
*/

export function jsonParser(req, res, next) {

  if (req.method === "POST" || req.method === "PUT") {

    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {

      if (!body) {
        req.body = {};
        return next();
      }

      try {

        req.body = JSON.parse(body);

      } catch {

        return res.status(400).json({
          success: false,
          message: "Invalid JSON body"
        });

      }

      next();

    });

  } else {

    next();

  }

}
