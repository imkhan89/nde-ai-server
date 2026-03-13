const express = require("express");
const bodyParser = require("body-parser");

const catalogEngine = require("./shopify_catalog_sync_engine");

const productSearchEngine = require("./product_search_engine.js");
const vehicleDetectionEngine = require("./vehicle_detection_engine.js");
const semanticPartsEngine = require("./semantic_parts_engine.js");

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

/*
ROOT
*/

app.get("/", (req, res) => {
    res.send("NDE Automotive AI Server Running");
});

/*
HEALTH CHECK
*/

app.get("/health", (req, res) => {

    res.json({
        status: "ok",
        service: "nde-ai-server"
    });

});

/*
VERIFY SHOPIFY CATALOG SYNC
*/

app.get("/catalog-status", (req, res) => {

    const totalProducts = catalogEngine.getProductCount();

    res.json({
        status: "ok",
        cached_products: totalProducts
    });

});

/*
SEARCH API
*/

app.post("/search", async (req, res) => {

    try {

        const query = req.body.query;

        if (!query) {

            return res.json({
                success: false,
                message: "Query required"
            });

        }

        console.log("User Query:", query);

        /*
        VEHICLE DETECTION
        */

        let vehicle = null;

        if (vehicleDetectionEngine.detectVehicle) {

            vehicle = vehicleDetectionEngine.detectVehicle(query);

        }

        /*
        PART DETECTION
        */

        let part = null;

        if (semanticPartsEngine.detectPart) {

            part = semanticPartsEngine.detectPart(query);

        }

        /*
        PRODUCT SEARCH
        */

        let results = [];

        if (productSearchEngine.searchProducts) {

            results = productSearchEngine.searchProducts(query);

        } else {

            results = catalogEngine.searchProducts(query);

        }

        res.json({
            success: true,
            query: query,
            vehicle: vehicle,
            part: part,
            results: results
        });

    } catch (error) {

        console.error("Search Error:", error);

        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });

    }

});

/*
START SERVER
*/

app.listen(PORT, async () => {

    console.log("NDE AI Server Running on port:", PORT);

    if (catalogEngine.startCatalogSync) {

        await catalogEngine.startCatalogSync();

    }

});
