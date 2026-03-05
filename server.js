/**
 * Final master server.js
 *
 * Single-file production-ready Automotive AI Assistant for ndestore.com
 * - WhatsApp webhook
 * - Intent detection
 * - Conversation flow / state machine
 * - Vehicle Garage (per-customer saved vehicles)
 * - Session memory (per-customer)
 * - Typo + alias normalization
 * - Part detection + semantic search
 * - Vehicle generation detection
 * - Vehicle fitment (exact compatibility) builder (from product titles where possible)
 * - Smart product ranking
 * - Cross-sell & upsell suggestions
 * - Self-learning (query frequency stored)
 * - Admin endpoints to reload indices, view status
 *
 * Requirements:
 * - node >= 14
 * - npm packages: (none required beyond core)
 * - Place product index file at ./index/product_index.json (Shopify export)
 * - Optionally place search_index.json at ./index/search_index.json
 *
 * NOTE: This file is intentionally self-contained. After placing your product index,
 * run: node server.js
 *
 * Author: generated for ndestore.com
 */

require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const INDEX_DIR = path.join(__dirname, "index");
const PRODUCT_INDEX_FILE = path.join(INDEX_DIR, "product_index.json");
const SEARCH_INDEX_FILE = path.join(INDEX_DIR, "search_index.json");
const LEARNING_FILE = path.join(__dirname, "learning.json");
const SESSIONS_FILE = path.join(__dirname, "sessions.json"); // optional persistent sessions

/* ============================================================
  In-memory stores (primary)
============================================================ */
let PRODUCT_INDEX = []; // array of { id, title, handle, tags, vendor, in_stock, popularity, meta }
let SEARCH_INDEX = [];  // optional prebuilt search index
let FITMENT_DB = {};    // built from explicit fitment data or inferred from titles
let LEARNING_DB = {};   // query -> count
let SESSIONS = {};      // customerId -> { lastActive, state, vehicle, garage:[], lastQuery, context }

/* ============================================================
  Core dictionaries for normalization and synonyms
  - Extend these objects based on local terms and observed typos.
============================================================ */

const TYPO_FIXES = {
  corola: "corolla",
  civc: "civic",
  break: "brake",
  breaks: "brake",
  miror: "mirror",
  filtre: "filter",
  filt: "filter",
  filtres: "filter",
  "a/c": "ac",
};

const VEHICLE_ALIASES = {
  gli: "corolla",
  grande: "corolla",
  reborn: "civic",
  rebirth: "civic",
  mehran: "mehran",
  bolan: "bolan",
};

const MODEL_MAKE = {
  corolla: "toyota",
  yaris: "toyota",
  hilux: "toyota",
  civic: "honda",
  city: "honda",
  alto: "suzuki",
  cultus: "suzuki",
  wagonr: "suzuki",
  swift: "suzuki",
  elantra: "hyundai",
  tucson: "hyundai",
  sportage: "kia",
  picanto: "kia",
};

const PART_SYNONYMS = {
  mirror: ["side mirror", "rear view mirror", "door mirror", "wing mirror"],
  "brake pad": ["brake pads", "brake-pad", "brake shoe"],
  "air filter": ["air filter", "engine filter"],
  "cabin filter": ["cabin filter", "ac filter"],
  headlight: ["head lamp", "front light"],
  bumper: ["bumper", "bumber"],
};

const SEMANTIC_MAP = {
  cooling: ["radiator", "coolant", "radiator cap"],
  engine: ["spark plug", "oil filter", "air filter"],
  brake: ["brake pad", "brake rotor"],
};

/* Vehicle generations sample (extend as needed) */
const VEHICLE_GENERATIONS = {
  corolla: [
    { gen: "10th", start: 2008, end: 2013 },
    { gen: "11th", start: 2014, end: 2020 },
    { gen: "12th", start: 2021, end: 2025 },
  ],
  civic: [
    { gen: "9th", start: 2012, end: 2015 },
    { gen: "10th", start: 2016, end: 2021 },
    { gen: "11th", start: 2022, end: 2025 },
  ],
};

/* Cross-sell map (seed) */
const CROSS_SELL_MAP = {
  "brake pad": ["brake rotor", "brake cleaner", "brake fluid"],
  radiator: ["coolant", "radiator cap", "thermostat"],
  "air filter": ["cabin filter", "engine oil"],
  "spark plug": ["ignition coil"],
};

/* ============================================================
  Utility helpers
============================================================ */

function nowISO() {
  return new Date().toISOString();
}

function safeLog(...args) {
  // simple logging wrapper
  console.log(nowISO(), ...args);
}

function xmlSafe(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function capitalize(s) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function uid(prefix = "") {
  return prefix + crypto.randomBytes(6).toString("hex");
}

/* ============================================================
  Persistence helpers: load/save learning & sessions
============================================================ */

function persistLearning() {
  try {
    fs.writeFileSync(LEARNING_FILE, JSON.stringify(LEARNING_DB, null, 2));
  } catch (e) {
    safeLog("persistLearning error:", e.message);
  }
}

function loadLearning() {
  try {
    if (fs.existsSync(LEARNING_FILE)) {
      LEARNING_DB = JSON.parse(fs.readFileSync(LEARNING_FILE));
    } else {
      LEARNING_DB = {};
    }
  } catch (e) {
    safeLog("loadLearning error:", e.message);
    LEARNING_DB = {};
  }
}

function persistSessions() {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(SESSIONS, null, 2));
  } catch (e) {
    safeLog("persistSessions error:", e.message);
  }
}

function loadSessions() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      SESSIONS = JSON.parse(fs.readFileSync(SESSIONS_FILE));
    } else {
      SESSIONS = {};
    }
  } catch (e) {
    safeLog("loadSessions error:", e.message);
    SESSIONS = {};
  }
}

/* ============================================================
  Load product indices & build FITMENT DB (simple inference)
  - product objects may include: id, title, handle, tags, vendor, in_stock (bool), popularity (number)
  - We infer fitment where titles contain model names + year ranges (e.g., "Corolla 2009-2014")
============================================================ */

function loadProductIndex() {
  PRODUCT_INDEX = [];
  try {
    if (!fs.existsSync(INDEX_DIR)) {
      fs.mkdirSync(INDEX_DIR, { recursive: true });
    }

    if (fs.existsSync(PRODUCT_INDEX_FILE)) {
      const raw = fs.readFileSync(PRODUCT_INDEX_FILE, "utf8");
      const parsed = JSON.parse(raw);
      // Expected to be array of Shopify product objects or simplified objects
      // Normalize to { id, title, handle, tags, vendor, in_stock, popularity, meta }
      PRODUCT_INDEX = parsed.map((p) => {
        if (p && p.title) {
          return {
            id: p.id || p.product_id || uid("p_"),
            title: String(p.title).toLowerCase(),
            handle: p.handle || (p.title ? slugify(p.title) : uid("h_")),
            tags: p.tags || p.tags?.split?.(",") || [],
            vendor: p.vendor || p.vendor_name || "",
            in_stock: typeof p.in_stock === "boolean" ? p.in_stock : true,
            popularity: typeof p.popularity === "number" ? p.popularity : p.total_sales || 0,
            meta: p.meta || {},
            raw: p,
          };
        }
        return null;
      }).filter(Boolean);
      safeLog("Loaded product index:", PRODUCT_INDEX.length, "entries");
    } else {
      safeLog("Product index file not found:", PRODUCT_INDEX_FILE);
    }
  } catch (e) {
    safeLog("Error loading product index:", e.message);
    PRODUCT_INDEX = [];
  }

  // Try to build FITMENT_DB by scanning titles for model names and year ranges
  buildFitmentFromProductTitles();
}

function loadSearchIndex() {
  try {
    if (fs.existsSync(SEARCH_INDEX_FILE)) {
      const raw = fs.readFileSync(SEARCH_INDEX_FILE, "utf8");
      SEARCH_INDEX = JSON.parse(raw);
      safeLog("Loaded search index:", SEARCH_INDEX.length);
    } else {
      SEARCH_INDEX = [];
      safeLog("No search_index.json found; SEARCH_INDEX empty.");
    }
  } catch (e) {
    safeLog("Error loading search index:", e.message);
    SEARCH_INDEX = [];
  }
}

/* ============================================================
  Simple slug helper (fallback)
============================================================ */

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/* ============================================================
  Build fitment DB from product titles (simple inference)
  - looks for model names and year or year ranges in product title
  - e.g. "Toyota Corolla 2009-2014 Brake Pads" => fitment[corolla]['brake pad'] = [2009,2014]
============================================================ */

function buildFitmentFromProductTitles() {
  FITMENT_DB = {}; // reset
  if (!PRODUCT_INDEX || !PRODUCT_INDEX.length) return;

  const modelKeys = Object.keys(MODEL_MAKE);
  const yearRangeRegex = /((19|20)\d{2})(\s*[-–]\s*((19|20)\d{2}))?/g; // matches 2009-2014 or 2010
  safeLog("Building fitment DB from product titles (inference)");

  for (const prod of PRODUCT_INDEX) {
    const title = prod.title || "";
    // find model words present in title
    for (const model of modelKeys) {
      if (title.includes(model)) {
        // find part keywords in title
        const detectedParts = detectPartsInText(title);
        if (!detectedParts.length) continue;

        // find year or range
        let match;
        let foundYears = [];
        while ((match = yearRangeRegex.exec(title)) !== null) {
          const start = parseInt(match[1], 10);
          const end = match[4] ? parseInt(match[4], 10) : start;
          if (start && end) foundYears.push([start, end]);
        }
        // if no explicit years found, treat product as applicable across a wide range
        if (!foundYears.length) {
          // choose generic range (2000-2030)
          foundYears = [[2000, 2030]];
        }

        // populate FITMENT_DB
        if (!FITMENT_DB[model]) FITMENT_DB[model] = {};
        for (const part of detectedParts) {
          if (!FITMENT_DB[model][part]) FITMENT_DB[model][part] = [];
          for (const yr of foundYears) {
            FITMENT_DB[model][part].push({ start: yr[0], end: yr[1], productId: prod.id });
          }
        }
      }
    }
  }

  // normalize ranges (merge overlapping)
  for (const model of Object.keys(FITMENT_DB)) {
    for (const part of Object.keys(FITMENT_DB[model])) {
      // compress to lowest start and highest end to keep check simple (we keep list but also compute envelope)
      const ranges = FITMENT_DB[model][part];
      let minStart = Number.POSITIVE_INFINITY;
      let maxEnd = Number.NEGATIVE_INFINITY;
      for (const r of ranges) {
        if (r.start < minStart) minStart = r.start;
        if (r.end > maxEnd) maxEnd = r.end;
      }
      FITMENT_DB[model][part + "__range"] = [minStart, maxEnd];
    }
  }

  safeLog("Fitment DB built (models):", Object.keys(FITMENT_DB).length);
}

/* ============================================================
  Detection helpers (text processing)
============================================================ */

function normalizeText(input) {
  if (!input) return [];
  let text = String(input).toLowerCase();
  // remove punctuation but keep - for ranges
  text = text.replace(/[^\w\s\-–—]/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  const tokens = text.split(" ").filter(Boolean).map((t) => TYPO_FIXES[t] || VEHICLE_ALIASES[t] || t);
  return tokens;
}

function detectVehicleFromTokens(tokens) {
  let make = null;
  let model = null;
  let year = null;

  for (const t of tokens) {
    if (!model && MODEL_MAKE[t]) {
      model = t;
      make = MODEL_MAKE[t];
      continue;
    }
    // detect 4-digit years
    if (!year && /^\d{4}$/.test(t)) {
      year = parseInt(t, 10);
      continue;
    }
  }

  return { make, model, year };
}

function detectGeneration(model, year) {
  if (!model || !year) return null;
  const gens = VEHICLE_GENERATIONS[model];
  if (!gens) return null;
  for (const g of gens) {
    if (year >= g.start && year <= g.end) return g.gen;
  }
  return null;
}

function detectPartsInText(text) {
  // build list from PART_SYNONYMS keys + direct words
  const parts = new Set();
  const tt = String(text).toLowerCase();
  // check synonyms map
  for (const canonical of Object.keys(PART_SYNONYMS)) {
    if (tt.includes(canonical)) {
      parts.add(canonical);
    } else {
      for (const alt of PART_SYNONYMS[canonical]) {
        if (tt.includes(alt)) {
          parts.add(canonical);
          break;
        }
      }
    }
  }
  // also check semantic map values
  for (const key of Object.keys(SEMANTIC_MAP)) {
    for (const v of SEMANTIC_MAP[key]) {
      if (tt.includes(v)) parts.add(v);
    }
  }
  // fallback: look for common part words
  const commonParts = ["mirror", "brake", "radiator", "bumper", "headlight", "filter", "spark", "plug"];
  for (const p of commonParts) {
    if (tt.includes(p)) {
      // map "brake" -> "brake pad" (prefer canonical)
      if (p === "brake") parts.add("brake pad");
      else if (p === "filter") parts.add("air filter");
      else parts.add(p);
    }
  }
  return Array.from(parts);
}

/* ============================================================
  Intent detection (simple rule-based)
============================================================ */

function detectIntent(message, tokens) {
  const txt = String(message).toLowerCase();

  // Order tracking intent
  if (/\b(order|track|tracking|where is my order|shipment|shipped)\b/.test(txt)) return "ORDER_TRACKING";

  // Delivery, charges
  if (/\b(delivery|charge|shipping|ship cost|shipment cost|delivery charge)\b/.test(txt)) return "DELIVERY_INQUIRY";

  // Returns / refunds
  if (/\b(return|refund|replace|replacement|warranty)\b/.test(txt)) return "RETURN_REQUEST";

  // Greetings
  if (/\b(hello|hi|assalam|salam|hey|good morning|good evening)\b/.test(txt)) return "GREETING";

  // Price / availability
  if (/\b(price|cost|available|stock|in stock|availability)\b/.test(txt)) return "PRODUCT_AVAILABILITY";

  // Direct product search: presence of model + part tokens
  const hasModel = tokens.some((t) => MODEL_MAKE[t]);
  const hasPart = detectPartsInText(txt).length > 0;
  if (hasModel || hasPart) return "PRODUCT_SEARCH";

  // Default fallback: support
  return "GENERAL_SUPPORT";
}

/* ============================================================
  Search & ranking logic
  - We support:
    - exact title contains query
    - token hits
    - fitment exact match gives big boost
    - in_stock boost
    - popularity boost
  - returns top N
============================================================ */

function buildQueryString(vehicle, part) {
  const pieces = [];
  if (vehicle.make) pieces.push(vehicle.make);
  if (vehicle.model) pieces.push(vehicle.model);
  if (vehicle.year) pieces.push(String(vehicle.year));
  if (part) pieces.push(part);
  return pieces.join(" ").trim();
}

function rankProductsByQuery(query, vehicle, part, limit = 5) {
  const qTokens = normalizeText(query);

  const scored = [];
  for (const p of PRODUCT_INDEX) {
    let score = 0;
    const title = p.title || "";

    // exact phrase presence
    if (query && title.includes(query)) score += 60;

    // token matches
    for (const qt of qTokens) {
      if (title.includes(qt)) score += 8;
    }

    // fitment match: if FITMENT_DB has model->part range and vehicle in that range, boost products that include model or year
    if (vehicle && vehicle.model && part) {
      const modelFit = FITMENT_DB[vehicle.model];
      // if we built ranges
      if (modelFit && modelFit[part + "__range"]) {
        const rng = modelFit[part + "__range"];
        if (vehicle.year && vehicle.year >= rng[0] && vehicle.year <= rng[1]) {
          score += 80; // strong boost for fitment match
        }
      }
      // if product title explicitly mentions the model, extra boost
      if (title.includes(vehicle.model)) score += 20;
      if (vehicle.year && title.includes(String(vehicle.year))) score += 15;
    }

    // in stock
    if (p.in_stock) score += 10;

    // popularity
    score += Math.min(30, p.popularity ? Math.floor(Math.log1p(p.popularity) * 6) : 0);

    if (score > 0) {
      scored.push({ product: p, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((r) => ({ ...r.product, score: r.score }));
}

/* ============================================================
  Cross-sell and upsell suggestions
============================================================ */

function getCrossSells(part) {
  if (!part) return [];
  if (CROSS_SELL_MAP[part]) return CROSS_SELL_MAP[part];
  // try simple semantic fallback
  for (const key of Object.keys(SEMANTIC_MAP)) {
    if (SEMANTIC_MAP[key].includes(part)) {
      // return first two related
      return SEMANTIC_MAP[key].slice(0, 3);
    }
  }
  return [];
}

/* ============================================================
  Self-learning: track queries and successful interactions
============================================================ */

function learnQuery(query) {
  if (!query || !query.trim()) return;
  const key = query.toLowerCase().trim();
  LEARNING_DB[key] = (LEARNING_DB[key] || 0) + 1;
  // persist occasionally (synchronously safe for small writes)
  try {
    fs.writeFileSync(LEARNING_FILE, JSON.stringify(LEARNING_DB, null, 2));
  } catch (e) {
    safeLog("learnQuery write error:", e.message);
  }
}

/* ============================================================
  Session & Garage Management
  - sessions keyed by WhatsApp From or other customer id passed in webhook
============================================================ */

function getSession(customerId) {
  if (!customerId) customerId = "anonymous";
  if (!SESSIONS[customerId]) {
    SESSIONS[customerId] = {
      lastActive: nowISO(),
      state: "IDLE",
      vehicle: null,
      garage: [],
      lastQuery: null,
      context: {},
    };
    // persist sessions occasionally
    try {
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(SESSIONS, null, 2));
    } catch (e) {
      // ignore
    }
  }
  SESSIONS[customerId].lastActive = nowISO();
  return SESSIONS[customerId];
}

function saveVehicleToGarage(session, vehicle) {
  if (!session || !vehicle || !vehicle.model) return;
  // avoid duplicates
  const exists = session.garage.some(
    (v) => v.make === vehicle.make && v.model === vehicle.model && v.year === vehicle.year
  );
  if (!exists) {
    session.garage.push(vehicle);
    // persist sessions
    try {
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(SESSIONS, null, 2));
    } catch (e) {}
  }
}

/* ============================================================
  Core AI reply formatter
============================================================ */

function formatProductList(products) {
  if (!products || !products.length) return "No exact matches found.";
  let out = "";
  for (const p of products) {
    out += `• ${capitalize(p.title.slice(0, 60))}\n  ${makeProductLink(p)}\n`;
  }
  return out;
}

function makeProductLink(product) {
  if (!product) return "";
  return `https://www.ndestore.com/products/${product.handle}`;
}

function buildSearchURL(query) {
  if (!query) return "https://www.ndestore.com/";
  return `https://www.ndestore.com/search?q=${encodeURIComponent(query)}&type=product&options%5Bprefix%5D=last`;
}

/* ============================================================
  High-level conversational AI engine (main)
  - Inputs: message text, customer id (From); returns reply string
  - Orchestrates intent detection, entity extraction, search, ranking, fitment, suggestions
============================================================ */

function automotiveAIEngine(messageText, customerId) {
  const session = getSession(customerId);
  const tokens = normalizeText(messageText);
  const intent = detectIntent(messageText, tokens);
  session.lastQuery = messageText;

  // attempt to detect vehicle & part
  let detectedVehicle = detectVehicleFromTokens(tokens);
  let detectedParts = detectPartsInText(messageText);
  // fallback semantic part
  if (!detectedParts.length) {
    for (const key of Object.keys(SEMANTIC_MAP)) {
      if (messageText.toLowerCase().includes(key)) {
        detectedParts.push(SEMANTIC_MAP[key][0]);
        break;
      }
    }
  }
  const part = detectedParts.length ? detectedParts[0] : null;

  // If session has vehicle saved and user didn't send one now, use stored
  if (!detectedVehicle.model && session.vehicle) {
    detectedVehicle = session.vehicle;
  }

  // Save detected vehicle to session and garage when fully specified
  if (detectedVehicle.model && detectedVehicle.make) {
    session.vehicle = detectedVehicle;
    saveVehicleToGarage(session, detectedVehicle);
  }

  // learn query
  learnQuery(buildQueryString(detectedVehicle, part));

  // Build reply skeleton
  let reply = `Thank you for contacting ndestore.com.\n\n`;

  // Handle intents
  switch (intent) {
    case "GREETING":
      session.state = "GREETING";
      reply += `Welcome to ndestore.com.\nWe supply genuine and durable auto parts across Pakistan.\n\n`;
      reply += `Please share your vehicle details (Make Model Year) or tell me the part you need.\nExample: "Corolla 2015 brake pads"`;
      return reply;

    case "ORDER_TRACKING":
      session.state = "ORDER_TRACKING";
      reply += `To check your order status kindly share your order number (e.g., #12345) and we will fetch tracking details for you.`;
      return reply;

    case "DELIVERY_INQUIRY":
      session.state = "DELIVERY_INQUIRY";
      reply += `Delivery charges are PKR 250 nationwide.\nMajor cities: 1-3 business days\nOther cities: 3-5 business days\nCash on Delivery available.`;
      return reply;

    case "RETURN_REQUEST":
      session.state = "RETURN_REQUEST";
      reply += `For returns/replacements please share your order number and a clear photo of the product and packaging. Our team will guide you.`;
      return reply;

    case "PRODUCT_AVAILABILITY":
      session.state = "PRODUCT_AVAILABILITY";
      reply += `Please share the product link or product name and we'll check availability immediately.`;
      return reply;

    case "GENERAL_SUPPORT":
      // fallthrough to product search if tokens indicate parts / vehicle
      break;

    case "PRODUCT_SEARCH":
    default:
      // continue
      break;
  }

  // If user asked product search but no vehicle provided and session vehicle missing, ask for vehicle
  if (intent === "PRODUCT_SEARCH" && !detectedVehicle.model) {
    session.state = "WAITING_FOR_VEHICLE";
    reply += `I can find the correct part for your vehicle. Kindly confirm your vehicle details:\nMake (e.g., Toyota)\nModel (e.g., Corolla)\nYear (e.g., 2015)\n\nOr just send: "Corolla 2015 brake pads"`;
    return reply;
  }

  // At this point either we have vehicle or user asked generic support; attempt search
  session.state = "SEARCHING";

  const query = buildQueryString(detectedVehicle, part);
  const gen = detectGeneration(detectedVehicle.model, detectedVehicle.year);

  reply += `Vehicle Identified:\n`;
  reply += `Make: ${detectedVehicle.make ? capitalize(detectedVehicle.make) : "Not specified"}\n`;
  reply += `Model: ${detectedVehicle.model ? capitalize(detectedVehicle.model) : "Not specified"}\n`;
  reply += `Year: ${detectedVehicle.year || "Not specified"}\n`;
  if (gen) reply += `Generation: ${gen}\n`;
  reply += `Part Requested: ${part ? capitalize(part) : "Not specified"}\n\n`;

  // Fitment check
  let fitmentOk = true;
  if (part && detectedVehicle.model && detectedVehicle.year) {
    const modelFit = FITMENT_DB[detectedVehicle.model];
    if (modelFit && modelFit[part + "__range"]) {
      const rng = modelFit[part + "__range"];
      if (detectedVehicle.year < rng[0] || detectedVehicle.year > rng[1]) {
        fitmentOk = false;
      }
    } // else unknown => allow
  }

  if (!fitmentOk) {
    reply += `⚠ Compatibility notice: The requested part may not match the provided vehicle year. Please confirm make/model/year.\n\n`;
  }

  reply += `Search results & suggestions:\n`;
  // Search + rank
  const top = rankProductsByQuery(query, detectedVehicle, part, 5);
  if (top && top.length) {
    reply += `Top matches:\n`;
    for (const p of top) {
      reply += `• ${capitalize(p.title.slice(0, 60))}\n  ${makeProductLink(p)}\n`;
    }
  } else {
    // fallback to broad search with just part and model
    const fallbackQuery = [detectedVehicle.make, detectedVehicle.model, part].filter(Boolean).join(" ");
    const fallback = rankProductsByQuery(fallbackQuery || part || detectedVehicle.model || "", detectedVehicle, part, 5);
    if (fallback && fallback.length) {
      reply += `Top matches (fallback):\n`;
      for (const p of fallback) {
        reply += `• ${capitalize(p.title.slice(0, 60))}\n  ${makeProductLink(p)}\n`;
      }
    } else {
      // no results -> provide search URL
      reply += `No direct matches found. Try browsing here:\n${buildSearchURL(query || part || detectedVehicle.model)}\n`;
    }
  }

  // Cross-sell & upsell
  const cross = getCrossSells(part);
  if (cross && cross.length) {
    reply += `\nRecommended add-ons:\n`;
    for (const c of cross) {
      reply += `• ${capitalize(c)}\n`;
    }
    reply += `\n`;
  }

  reply += `\nIf you'd like, reply "Buy 1" with the product handle shown above or share more vehicle details to improve results.`;

  return reply;
}

/* ============================================================
  Webhook: WhatsApp (Twilio or similar)
  - expects POST form fields: Body, From (or JSON equivalent)
  - returns TwiML XML (basic) with message text
============================================================ */

app.post("/whatsapp", (req, res) => {
  try {
    const incoming = (req.body.Body || req.body.body || req.body.message || "").toString();
    const from = req.body.From || req.body.from || req.body.FromNumber || req.body.fromNumber || "anonymous";

    const reply = automotiveAIEngine(incoming, from);

    res.set("Content-Type", "text/xml");
    res.status(200).send(`<Response><Message>${xmlSafe(reply)}</Message></Response>`);
  } catch (err) {
    safeLog("whatsapp webhook error:", err.message);
    res.set("Content-Type", "text/xml");
    res.status(200).send(`<Response><Message>${xmlSafe("Server error. Kindly try again.")}</Message></Response>`);
  }
});

/* ============================================================
  Admin & utility endpoints (protected by simple token if provided)
  For production secure with proper auth.
============================================================ */

function checkAdminAuth(req) {
  const tokenHeader = req.get("x-admin-token") || req.query.admin_token;
  // compare with env var if set
  if (process.env.ADMIN_TOKEN) {
    return tokenHeader && tokenHeader === process.env.ADMIN_TOKEN;
  }
  // not configured -> allow local
  return true;
}

app.post("/admin/reload-index", (req, res) => {
  if (!checkAdminAuth(req)) return res.status(403).json({ ok: false, error: "forbidden" });
  try {
    loadProductIndex();
    loadSearchIndex();
    return res.json({ ok: true, products: PRODUCT_INDEX.length, fitmentModels: Object.keys(FITMENT_DB).length });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

app.get("/admin/status", (req, res) => {
  if (!checkAdminAuth(req)) return res.status(403).json({ ok: false, error: "forbidden" });
  const sessionsCount = Object.keys(SESSIONS).length;
  return res.json({
    ok: true,
    port: PORT,
    products: PRODUCT_INDEX.length,
    sessions: sessionsCount,
    fitmentModels: Object.keys(FITMENT_DB).length,
  });
});

app.get("/admin/learning", (req, res) => {
  if (!checkAdminAuth(req)) return res.status(403).json({ ok: false, error: "forbidden" });
  return res.json({ ok: true, learningKeys: Object.keys(LEARNING_DB).length });
});

/* ============================================================
  Simple status root
============================================================ */

app.get("/", (req, res) => {
  res.json({
    service: "ndestore Automotive AI Assistant",
    version: "1.0",
    uptime: process.uptime(),
    productsLoaded: PRODUCT_INDEX.length,
  });
});

/* ============================================================
  Initialization
============================================================ */

function init() {
  loadLearning();
  loadSessions();
  loadProductIndex();
  loadSearchIndex();
  safeLog("Server initialized");
}

init();

/* ============================================================
  Clean shutdown persistence
============================================================ */

process.on("SIGINT", () => {
  safeLog("SIGINT received, persisting state...");
  try {
    fs.writeFileSync(LEARNING_FILE, JSON.stringify(LEARNING_DB, null, 2));
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(SESSIONS, null, 2));
  } catch (e) {}
  process.exit(0);
});

process.on("SIGTERM", () => {
  safeLog("SIGTERM received, persisting state...");
  try {
    fs.writeFileSync(LEARNING_FILE, JSON.stringify(LEARNING_DB, null, 2));
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(SESSIONS, null, 2));
  } catch (e) {}
  process.exit(0);
});

/* ============================================================
  Start server
============================================================ */

app.listen(PORT, () => {
  safeLog(`NDE Automotive AI Assistant running on port ${PORT}`);
});
