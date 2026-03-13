// server.js

const express = require("express");
const bodyParser = require("body-parser");

const catalogEngine = require("./shopify_catalog_sync_engine");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("NDE AI Server Running");
});

app.get("/health", (req, res) => {
    res.send("OK");
});

app.post("/search", (req, res) => {

    const query = req.body.query;

    if (!query) {
        return res.json({
            success: false,
            message: "Query required"
        });
    }

    const results = catalogEngine.searchProducts(query);

    res.json({
        success: true,
        results: results
    });

});

app.listen(PORT, async () => {

    console.log("Server running on port:", PORT);

    await catalogEngine.startCatalogSync();

});
