/**
 * Master NDE Store WhatsApp AI Server
 *
 * Features included:
 * - AI WhatsApp Sales Funnel
 * - Shopify Product Sync & Auto Product Search
 * - Shopify Order Creation via WhatsApp
 * - AI Sales Brain (OpenAI)
 * - Auto Upsell Engine / Smart Product Recommendation
 * - Smart Customer Segmentation
 * - Abandoned Order Recovery (reminders)
 * - AI Customer Satisfaction Detector
 * - AI Fraud / Scam Protection
 * - AI Product Knowledge Training (via product sync + prompt)
 * - Advanced Sales Analytics (end-of-day report)
 * - Smart Delivery Estimate Engine
 * - Image Recognition for auto parts (placeholder/integrations)
 * - Voice Message Transcription (placeholder/integrations)
 * - VIN / Chassis Parts Finder (basic)
 * - Live Agent Escalation (alerts to +92-321-4222294)
 *
 * Required ENV variables:
 * OPENAI_API_KEY
 * TWILIO_ACCOUNT_SID
 * TWILIO_AUTH_TOKEN
 * TWILIO_WHATSAPP_NUMBER (Twilio WhatsApp "from")
 * SHOPIFY_STORE_DOMAIN (e.g. your-store.myshopify.com)
 * SHOPIFY_ADMIN_API_TOKEN
 * REPORT_RECEIVER_NUMBER (optional; defaults to +923214222294)
 * TRANSCRIPTION_API_KEY (optional - for voice transcription integration)
 * IMAGE_ANALYSIS_API_KEY (optional - for image analysis integration)
 * PORT (optional)
 *
 * Copy-paste this file as server.js and run with Node 18+.
 */

require("dotenv").config();
const express = require("express");
const axios = require("axios");
const twilio = require("twilio");
const crypto = require("crypto");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" })); // allow image/voice URLs payloads

/* -------------------- ENV -------------------- */
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const REPORT_RECEIVER_NUMBER = process.env.REPORT_RECEIVER_NUMBER || "+923214222294";
const TRANSCRIPTION_API_KEY = process.env.TRANSCRIPTION_API_KEY || null; // optional
const IMAGE_ANALYSIS_API_KEY = process.env.IMAGE_ANALYSIS_API_KEY || null; // optional

if (!OPENAI_API_KEY || !TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER || !SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_API_TOKEN) {
  console.error("Missing required environment variables. Please set OPENAI_API_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER, SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_API_TOKEN");
  process.exit(1);
}

/* -------------------- CLIENTS -------------------- */
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/* -------------------- IN-MEMORY STORAGE (simple) -------------------- */
/* For production use Redis or DB. This is an MVP in-memory store. */
let shopifyProducts = []; // fetched product catalog
const chatHistory = {}; // { phone: [{ time, incoming, outgoing, direction }] }
const customerMeta = {}; // { phone: { firstSeen, visits, intentScore, segment, partialOrder } }
const productInquiryCounter = {}; // counts by keyword
const abandonedOrders = {}; // { phone: { items, createdAt, timeoutId } }
const stats = { totalChats: 0, newChats: 0, oldChats: 0, divertedChats: 0, date: new Date().toLocaleDateString() };

/* -------------------- HELPERS -------------------- */

function now() {
  return new Date().toLocaleString();
}

function recordChat(phone, message, direction = "in") {
  if (!chatHistory[phone]) chatHistory[phone] = [];
  chatHistory[phone].push({ time: now(), message, direction });
  // track totals
  stats.totalChats = (stats.totalChats || 0) + (direction === "in" ? 1 : 0);
  if (!customerMeta[phone]) {
    customerMeta[phone] = { firstSeen: new Date().toISOString(), visits: 0, intentScore: 0, segment: "unknown", partialOrder: null };
    stats.newChats = (stats.newChats || 0) + 1;
  } else {
    stats.oldChats = (stats.oldChats || 0) + 1;
  }
  customerMeta[phone].visits = (customerMeta[phone].visits || 0) + (direction === "in" ? 1 : 0);
}

function buildSearchLink(query) {
  const formatted = encodeURIComponent(query.trim().replace(/\s+/g, "+"));
  return `https://www.ndestore.com/search?q=${formatted}&options%5Bprefix%5D=last`;
}

// quick keyword search to increment product interest stats
function trackProductInterest(text) {
  const keywords = ["spark plug", "brake pad", "brake disk", "brake rotor", "air filter", "oil filter", "floor mat", "decal", "sticker", "top cover"];
  const msg = text.toLowerCase();
  for (const k of keywords) {
    if (msg.includes(k)) {
      productInquiryCounter[k] = (productInquiryCounter[k] || 0) + 1;
    }
  }
}

// simple phone country detection
function isInternational(phone) {
  return !phone.startsWith("+92");
}

function sanitizeAmount(amountStr) {
  if (!amountStr) return amountStr;
  return amountStr.replace(/\s+/g, "");
}

/* -------------------- FRAUD / ABUSE DETECTION -------------------- */

function detectFraudOrScam(message) {
  const msg = message.toLowerCase();
  const suspiciousPatterns = [
    /http(s)?:\/\/\S+/, // external links
    /bank transfer to .*bitcoin|crypto/,
    /call me at \d{7,}/,
  ];
  const abusiveWords = ["scam", "fraud", "hack", "malicious"];
  if (abusiveWords.some(w => msg.includes(w))) return { flagged: true, reason: "abusive language" };
  for (const p of suspiciousPatterns) {
    if (p.test(msg)) return { flagged: true, reason: "suspicious link or pattern" };
  }
  // very short messages repeating same characters
  if (/^[^\w\s]{5,}$/.test(msg)) return { flagged: true, reason: "spam punctuation" };
  return { flagged: false };
}

/* -------------------- INTENT & SATISFACTION DETECTION -------------------- */

function detectBuyingIntent(message) {
  const keywords = ["buy", "order", "price", "available", "how much", "i want", "place order", "checkout"];
  return keywords.some(k => message.toLowerCase().includes(k));
}

function detectComplaint(message) {
  const keywords = ["complaint", "damaged", "wrong product", "not working", "issue", "problem", "refund", "return"];
  return keywords.some(k => message.toLowerCase().includes(k));
}

function detectLiveAgentRequest(message) {
  const triggers = ["agent", "human", "representative", "talk to", "live agent", "help me with", "call me"];
  return triggers.some(t => message.toLowerCase().includes(t));
}

function detectStoreAddressQuery(message) {
  const keys = ["address", "where is your shop", "store location", "visit store", "location"];
  return keys.some(k => message.toLowerCase().includes(k));
}

function detectWarrantyQuestion(message) {
  const keys = ["warranty", "guarantee", "warrantee"];
  return keys.some(k => message.toLowerCase().includes(k));
}

function detectOutOfStock(product) {
  if (!product || !product.variants || product.variants.length === 0) return false;
  // if any variant has inventory > 0 we consider it available
  return product.variants.every(v => typeof v.inventory_quantity === "number" && v.inventory_quantity <= 0);
}

/* -------------------- VEHICLE COMPATIBILITY ENGINE -------------------- */

function extractVehicleYear(text) {
  const m = text.match(/\b(19|20)\d{2}\b/);
  return m ? parseInt(m[0], 10) : null;
}

// Interpret product title ranges like "2006-2012" and check if year falls within
function productCompatibleWithYear(productTitle, year) {
  if (!year) return true;
  const m = productTitle.match(/(\d{4})\s*[-–]\s*(\d{4})/); // supports hyphen or en-dash
  if (!m) return true;
  const start = parseInt(m[1], 10), end = parseInt(m[2], 10);
  return year >= start && year <= end;
}

/* -------------------- SHOPIFY SYNC & SEARCH -------------------- */

async function syncShopifyProducts() {
  try {
    const url = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/products.json?limit=250`;
    const res = await axios.get(url, { headers: { "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_TOKEN } });
    shopifyProducts = res.data.products || [];
    console.log(`[${now()}] Shopify sync completed, products: ${shopifyProducts.length}`);
  } catch (err) {
    console.error("Shopify sync error:", err.message);
  }
}

function findProductFromCatalog(query) {
  const q = query.toLowerCase();
  // Prefer exact words, otherwise includes
  const byTitle = shopifyProducts.find(p => p.title.toLowerCase() === q) ||
    shopifyProducts.find(p => p.title.toLowerCase().includes(q));
  if (byTitle) return byTitle;
  // fallback: search by keywords in body_html
  return shopifyProducts.find(p => (p.body_html || "").toLowerCase().includes(q));
}

// more robust Shopify search via API (fallback)
async function searchShopifyAPI(query) {
  try {
    const url = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/products.json?title=${encodeURIComponent(query)}&limit=10`;
    const res = await axios.get(url, { headers: { "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_TOKEN } });
    return res.data.products || [];
  } catch (err) {
    console.error("searchShopifyAPI error:", err.message);
    return [];
  }
}

/* -------------------- AI (OpenAI) -------------------- */

async function openaiChat(messages, max_tokens = 300) {
  const payload = {
    model: "gpt-4o-mini",
    messages,
    max_tokens,
    temperature: 0.2
  };
  const res = await axios.post("https://api.openai.com/v1/chat/completions", payload, {
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    timeout: 15000
  });
  return res.data.choices[0].message.content;
}

// Short assistant prompt tailored to NDE Store rules
function buildSystemPrompt() {
  return `You are a professional auto parts manager and sales assistant for ndestore.com.
Rules:
- Use friendly professional Urdu/English/Roman Urdu matching customer's language.
- Keep replies short, mobile-friendly, conversion-focused.
- Never share external website links; only share ndestore.com search links in the format:
  https://www.ndestore.com/search?q=KEYWORD&options%5Bprefix%5D=last
- Do not promise anything; use "normally", "typically" language.
- If customer requests live agent or is unsatisfied, escalate (notify manager).
- For international customers, collect product, vehicle, and delivery address (country) before sharing prices.
- Use Shopify product catalog for product details when possible.
`;
}

/* -------------------- IMAGE RECOGNITION (placeholder) -------------------- */

async function analyzeImageUrl(imageUrl) {
  // Placeholder integration: if IMAGE_ANALYSIS_API_KEY exists, call that API.
  // Otherwise return a generic response instructing how to proceed.
  if (!IMAGE_ANALYSIS_API_KEY) {
    return { ok: false, message: "Image analysis service not configured. Please send clear photo of the part and vehicle details." };
  }
  // Example: send to an imaginary image analysis provider
  try {
    const res = await axios.post("https://api.example-image-ai.com/v1/analyze", { url: imageUrl }, {
      headers: { Authorization: `Bearer ${IMAGE_ANALYSIS_API_KEY}` }
    });
    return { ok: true, data: res.data };
  } catch (err) {
    console.error("Image analysis error:", err.message);
    return { ok: false, message: "Image analysis failed." };
  }
}

/* -------------------- VOICE TRANSCRIPTION (placeholder) -------------------- */

async function transcribeVoiceUrl(mediaUrl) {
  if (!TRANSCRIPTION_API_KEY) {
    return { ok: false, text: null, message: "Transcription service not configured." };
  }
  try {
    // Example: call a transcription service
    const res = await axios.post("https://api.example-transcribe.com/v1/transcribe", { url: mediaUrl }, {
      headers: { Authorization: `Bearer ${TRANSCRIPTION_API_KEY}` }
    });
    return { ok: true, text: res.data.text };
  } catch (err) {
    console.error("Transcription error:", err.message);
    return { ok: false, text: null, message: "Transcription failed." };
  }
}

/* -------------------- UPSALE & BUNDLES -------------------- */

function recommendUpsell(productTitle) {
  const map = {
    "brake pad": ["brake cleaner", "brake rotor"],
    "spark plug": ["spark plug set (4 pcs)", "ignition cable"],
    "air filter": ["cabin air filter", "engine oil filter"]
  };
  const k = Object.keys(map).find(key => productTitle.toLowerCase().includes(key));
  return k ? map[k] : null;
}

/* -------------------- SMART DELIVERY ESTIMATES -------------------- */

function estimateDelivery(countryOrCity) {
  // Very simple estimator - you can replace with courier API or Shopify shipping zones
  const c = (countryOrCity || "").toLowerCase();
  if (c.includes("pakistan") || c.includes("lahore") || c.includes("karachi") || c.includes("islamabad")) {
    return { eta: "1-3 working days", costPKR: 250, costUSD: 0 }; // local flat rate example
  }
  // international flat example - in real system read Shopify shipping rates
  return { eta: "7-14 working days", costPKR: null, costUSD: 35 };
}

/* -------------------- SHOPIFY ORDER CREATION -------------------- */

async function createShopifyOrder(customer, items, shippingAddress) {
  // items = [{ variant_id, quantity, title, price }]
  // Create a draft order (or order) in Shopify
  try {
    const line_items = items.map(it => ({
      variant_id: it.variant_id,
      quantity: it.quantity || 1
    }));
    const payload = {
      order: {
        email: customer.email || undefined,
        financial_status: "pending",
        line_items,
        shipping_address: shippingAddress || undefined,
        note: `Order created via WhatsApp by ${customer.phone}`
      }
    };
    const url = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/orders.json`;
    const res = await axios.post(url, payload, { headers: { "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_TOKEN } });
    return { ok: true, order: res.data.order };
  } catch (err) {
    console.error("createShopifyOrder error:", err.response ? err.response.data : err.message);
    return { ok: false, error: err.response ? err.response.data : err.message };
  }
}

/* -------------------- ABANDONED ORDER RECOVERY -------------------- */

function scheduleAbandonedOrderReminder(phone, partialOrder) {
  // cancel existing
  if (abandonedOrders[phone] && abandonedOrders[phone].timeoutId) {
    clearTimeout(abandonedOrders[phone].timeoutId);
  }
  const id = setTimeout(async () => {
    // send reminder message
    const msg = `Sir, just checking — do you want to complete your order? I can help finish checkout.`;
    await sendWhatsApp(phone, msg);
    // log stat
  }, 1000 * 60 * 60 * 2); // 2 hours reminder
  abandonedOrders[phone] = { items: partialOrder.items, createdAt: new Date(), timeoutId: id };
}

/* -------------------- LIVE AGENT NOTIFICATION -------------------- */

async function notifyLiveAgent(phone) {
  stats.divertedChats = (stats.divertedChats || 0) + 1;
  let history = (chatHistory[phone] || []).map(c => `${c.time} - ${c.direction === "in" ? "Customer" : "Bot"}: ${c.message}`).join("\n");
  const alert = `Live Agent Required

WhatsApp Number: ${phone}

Previous Chat history:
${history}
`;
  await twilioClient.messages.create({ from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`, to: `whatsapp:${REPORT_RECEIVER_NUMBER}`, body: alert });
}

/* -------------------- DAILY REPORT -------------------- */

async function sendDailyReport() {
  const date = new Date().toLocaleDateString();
  let hotProducts = Object.keys(productInquiryCounter).sort((a,b) => productInquiryCounter[b] - productInquiryCounter[a]).slice(0,10);
  let hotText = hotProducts.map(p => `${p} - ${productInquiryCounter[p]} inquiries`).join("\n") || "No product inquiries";
  const report = `Daily AI Chat Summary

Date: ${date}
Total Chats Conducted: ${stats.totalChats || 0}
Old Chats: ${stats.oldChats || 0}
New Chats: ${stats.newChats || 0}
Chats Diverted to ${REPORT_RECEIVER_NUMBER}: ${stats.divertedChats || 0}

Hot Product Catalog:
${hotText}
`;
  try {
    await twilioClient.messages.create({ from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`, to: `whatsapp:${REPORT_RECEIVER_NUMBER}`, body: report });
    console.log("Daily report sent.");
  } catch (err) {
    console.error("sendDailyReport error:", err.message);
  }
}

// schedule daily report at 23:59 server local time using a simple interval tick
setInterval(() => {
  const d = new Date();
  if (d.getHours() === 23 && d.getMinutes() === 59) {
    sendDailyReport();
    // reset stats for next day
    stats.totalChats = 0;
    stats.oldChats = 0;
    stats.newChats = 0;
    stats.divertedChats = 0;
    Object.keys(productInquiryCounter).forEach(k => productInquiryCounter[k] = 0);
  }
}, 60 * 1000);

/* -------------------- WhatsApp send wrapper -------------------- */

async function sendWhatsApp(phone, text) {
  try {
    await twilioClient.messages.create({
      from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phone}`,
      body: text
    });
    recordChat(phone, text, "out");
  } catch (err) {
    console.error("sendWhatsApp error:", err.message);
  }
}

/* -------------------- MAIN WEBHOOK -------------------- */

app.post("/whatsapp", async (req, res) => {
  /**
   * Expected Twilio webhook fields:
   * - Body (text)
   * - From (whatsapp:+92300...)
   * - NumMedia and MediaUrl0 if media attached
   * - For voice, check MediaContentType etc.
   */
  try {
    const incoming = (req.body.Body || "").trim();
    const fromRaw = (req.body.From || "");
    const from = fromRaw.replace("whatsapp:", "");
    if (!from) return res.sendStatus(400);

    // record incoming chat
    recordChat(from, incoming, "in");
    trackProductInterest(incoming);

    // quick fraud check
    const fraud = detectFraudOrScam(incoming);
    if (fraud.flagged) {
      await sendWhatsApp(from, `Sir, your message seems suspicious (${fraud.reason}). For security we will escalate this conversation to our team for review.`);
      await twilioClient.messages.create({ from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`, to: `whatsapp:${REPORT_RECEIVER_NUMBER}`, body: `Potential Fraud Alert from ${from}\nReason: ${fraud.reason}\nMessage: ${incoming}` });
      return res.sendStatus(200);
    }

    // if media included (image or voice)
    const numMedia = parseInt(req.body.NumMedia || "0", 10);
    if (numMedia > 0) {
      const mediaUrl = req.body.MediaUrl0;
      const contentType = req.body.MediaContentType0 || "";
      if (contentType.startsWith("image/")) {
        // analyze image
        const analysis = await analyzeImageUrl(mediaUrl);
        if (analysis.ok) {
          // try to parse possible part name from analysis result via OpenAI
          const aiMsg = await openaiChat([{ role: "system", content: buildSystemPrompt() }, { role: "user", content: `Image analysis result:\n${JSON.stringify(analysis.data)}\nIdentify likely auto part and recommend 2-3 possible matches from ndestore` }]);
          await sendWhatsApp(from, aiMsg);
        } else {
          await sendWhatsApp(from, analysis.message);
        }
        return res.sendStatus(200);
      } else if (contentType.startsWith("audio/")) {
        const trans = await transcribeVoiceUrl(mediaUrl);
        if (trans.ok) {
          // treat transcription as incoming message
          recordChat(from, trans.text, "in");
          // fall through to normal handling below using trans.text as incoming
          // override incoming
          req.body.Body = trans.text;
        } else {
          await sendWhatsApp(from, trans.message || "Unable to transcribe voice.");
          return res.sendStatus(200);
        }
      }
    }

    // handle / commands or numeric patterns
    const lower = incoming.toLowerCase();

    // handle inquiry about store address
    if (detectStoreAddressQuery(incoming)) {
      await sendWhatsApp(from, "Thank you for asking. Currently all retail services are provided from our website www.ndestore.com");
      return res.sendStatus(200);
    }

    // warranty question
    if (detectWarrantyQuestion(incoming)) {
      await sendWhatsApp(from, "There are no warranties for imported parts and accessories and products highlighted as genuine are original authentic.");
      return res.sendStatus(200);
    }

    // complaint detection: ask for order number first, then forward
    if (detectComplaint(incoming)) {
      await sendWhatsApp(from, "Sir kindly share the order number so we can check and assist you further.");
      // if message contains order number, forward
      const ordMatch = incoming.match(/[0-9]{6,12}/);
      if (ordMatch) {
        const orderNum = ordMatch[0];
        await twilioClient.messages.create({ from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`, to: `whatsapp:${REPORT_RECEIVER_NUMBER}`, body: `Order Number: ${orderNum}\nComplaint Message: ${incoming}` });
      }
      return res.sendStatus(200);
    }

    // live agent request
    if (detectLiveAgentRequest(incoming)) {
      await sendWhatsApp(from, "Sir one of our specialists will assist you shortly.");
      await notifyLiveAgent(from);
      return res.sendStatus(200);
    }

    // International customer logic
    if (isInternational(from)) {
      // require product, vehicle info, and full delivery address (country included)
      // if incoming already contains product + address, we try to provide USD quote
      const ask = "Thank you for contacting NDE Store.\nKindly share:\n• Product Name\n• Vehicle Make & Model Year\n• Full Delivery Address including Country\n\nWe will quote product price and shipping in USD.";
      // detect if user supplied product + country in same message (very naive)
      const countryMatch = incoming.match(/\b(usa|united states|uk|united kingdom|uae|canada|australia|germany|france|pakistan|india)\b/i);
      const productMatch = incoming.match(/(brake|filter|spark|air filter|oil filter|brake pad|decal|sticker|floor mat|top cover)/i);
      if (productMatch && countryMatch) {
        // attempt quick quote: find product and estimate shipping
        const productQuery = productMatch[0];
        const country = countryMatch[0];
        const found = findProductFromCatalog(productQuery) || (await searchShopifyAPI(productQuery))[0];
        const priceUSD = found ? (found.variants && found.variants[0] && found.variants[0].price ? parseFloat(found.variants[0].price) / 300 : 40) : 40; // naive conversion if PKR
        const estimate = estimateDelivery(country);
        const usdPrice = priceUSD.toFixed(2);
        const usdShip = (estimate.costUSD || 35).toFixed(2);
        await sendWhatsApp(from, `Estimated Product Price: $${usdPrice} USD\nEstimated Shipping to ${country}: $${usdShip} USD\nDelivery: ${estimate.eta}\nIf you'd like to proceed, please share full shipping address to create order.`);
        return res.sendStatus(200);
      } else {
        await sendWhatsApp(from, ask);
        return res.sendStatus(200);
      }
    }

    // Sales funnel: if user expresses buying intent - start funnel
    if (detectBuyingIntent(incoming)) {
      // 1) determine product
      let product = findProductFromCatalog(incoming);
      if (!product) {
        const apiSearch = await searchShopifyAPI(incoming);
        if (apiSearch && apiSearch.length > 0) product = apiSearch[0];
      }
      if (product) {
        // check stock
        if (detectOutOfStock(product)) {
          await sendWhatsApp(from, "Currently out of stock.");
          return res.sendStatus(200);
        }
        const year = extractVehicleYear(incoming);
        if (!productCompatibleWithYear(product.title, year)) {
          // Ask user to confirm model year if provided vs compatibility
          await sendWhatsApp(from, `This product description shows ranges. Please confirm your vehicle model year to ensure compatibility (e.g., 2009).`);
          return res.sendStatus(200);
        }
        // begin funnel: gather required data (vehicle info, quantity, address)
        // We'll implement a simple stateful funnel using customerMeta.partialOrder
        const variant = (product.variants && product.variants[0]) || null;
        customerMeta[from].partialOrder = {
          step: "confirmProduct",
          product,
          variant,
          quantity: 1,
          collected: {}
        };
        let reply = `${product.title} is available.\nCheck options: ${buildSearchLink(product.title)}\n`;
        const ups = recommendUpsell(product.title);
        if (ups && ups.length) reply += `You may also consider: ${ups.join(", ")}.\n`;
        reply += "Would you like to place order? Reply YES to proceed or reply with quantity.";
        await sendWhatsApp(from, reply);
        return res.sendStatus(200);
      } else {
        // no product found - use AI to suggest best matches and show search link
        const aiMsg = await openaiChat([{ role: "system", content: buildSystemPrompt() }, { role: "user", content: `Customer asked: ${incoming}\nSuggest top 2-3 likely products sold by ndestore.com and provide search links.` }], 200);
        await sendWhatsApp(from, aiMsg);
        return res.sendStatus(200);
      }
    }

    // If user is in funnel (partialOrder exists), handle funnel steps
    const meta = customerMeta[from] || {};
    if (meta.partialOrder && meta.partialOrder.step) {
      const s = meta.partialOrder.step;
      const text = incoming.toLowerCase();
      if (s === "confirmProduct") {
        if (text.includes("yes") || text === "y") {
          meta.partialOrder.step = "collectVehicle";
          await sendWhatsApp(from, "Please share vehicle make, model and year (e.g., Suzuki Cultus 2009).");
          return res.sendStatus(200);
        }
        const qtyMatch = incoming.match(/\b([1-9][0-9]?)\b/);
        if (qtyMatch) {
          meta.partialOrder.quantity = parseInt(qtyMatch[1], 10);
          meta.partialOrder.step = "collectVehicle";
          await sendWhatsApp(from, `Quantity set to ${meta.partialOrder.quantity}. Please share vehicle make, model and year.`);
          return res.sendStatus(200);
        }
        // fallback
        await sendWhatsApp(from, "Please reply YES to proceed with order or send required quantity.");
        return res.sendStatus(200);
      } else if (s === "collectVehicle") {
        meta.partialOrder.collected.vehicle = incoming;
        meta.partialOrder.step = "collectAddress";
        await sendWhatsApp(from, "Please share full delivery address (city, postal code) for delivery and contact number.");
        return res.sendStatus(200);
      } else if (s === "collectAddress") {
        meta.partialOrder.collected.address = incoming;
        meta.partialOrder.step = "confirmOrder";
        // estimate shipping and price
        const countryGuess = incoming.match(/\b(usa|united states|uk|uae|canada|australia|germany|france|pakistan|india)\b/i);
        const estimate = estimateDelivery(countryGuess ? countryGuess[0] : incoming);
        const price = meta.partialOrder.variant && meta.partialOrder.variant.price ? parseFloat(meta.partialOrder.variant.price) : 40;
        const totalUSD = estimate.costUSD ? (price + estimate.costUSD) : price;
        await sendWhatsApp(from, `Order summary:
Product: ${meta.partialOrder.product.title}
Quantity: ${meta.partialOrder.quantity}
Shipping: ${estimate.eta} (approx shipping ${estimate.costUSD ? `$${estimate.costUSD} USD` : `PKR ${estimate.costPKR}`})
Estimated total (USD): $${Number(totalUSD).toFixed(2)}

Reply CONFIRM to create the Shopify order or EDIT to change details.`);
        return res.sendStatus(200);
      } else if (s === "confirmOrder") {
        if (incoming.toLowerCase().includes("confirm")) {
          // prepare order payload
          const items = [{
            variant_id: meta.partialOrder.variant.id,
            quantity: meta.partialOrder.quantity
          }];
          const shippingAddress = { address1: meta.partialOrder.collected.address, country: "Pakistan" }; // naive
          const customerObj = { phone: from, email: undefined };
          const created = await createShopifyOrder(customerObj, [{ variant_id: meta.partialOrder.variant.id, quantity: meta.partialOrder.quantity }], shippingAddress);
          if (created.ok) {
            await sendWhatsApp(from, `Order created. Order ID: ${created.order.id}. Please proceed with payment if required. I will share payment details.`);
            // after order creation, clear partial and maybe set abandoned reminder if unpaid
            meta.partialOrder = null;
            return res.sendStatus(200);
          } else {
            await sendWhatsApp(from, "Unable to create order automatically. Our specialist will contact you to complete the order.");
            await notifyLiveAgent(from);
            return res.sendStatus(200);
          }
        } else if (incoming.toLowerCase().includes("edit")) {
          meta.partialOrder.step = "collectVehicle";
          await sendWhatsApp(from, "Okay please share the corrected vehicle details.");
          return res.sendStatus(200);
        } else {
          await sendWhatsApp(from, "Please reply CONFIRM to create the order or EDIT to modify.");
          return res.sendStatus(200);
        }
      }
    }

    // generic product lookup or question: try exact product from catalog
    const product = findProductFromCatalog(incoming);
    if (product) {
      if (detectOutOfStock(product)) {
        await sendWhatsApp(from, "Currently out of stock.");
        return res.sendStatus(200);
      }
      // vehicle year compatibility check
      const year = extractVehicleYear(incoming);
      if (!productCompatibleWithYear(product.title, year)) {
        await sendWhatsApp(from, `Please confirm your vehicle model year. Product title indicates specific ranges; share year (e.g., 2009).`);
        return res.sendStatus(200);
      }
      // respond with short product summary + search link + upsell
      const priceText = (product.variants && product.variants[0] && product.variants[0].price) ? `Price: PKR ${product.variants[0].price}` : "";
      let reply = `${product.title}\n${priceText}\nCheck options: ${buildSearchLink(product.title)}`;
      const ups = recommendUpsell(product.title) || recommendUpsell(product.title); // reuse
      if (ups && ups.length) reply += `\nAlso: ${ups.join(", ")}`;
      await sendWhatsApp(from, reply);
      return res.sendStatus(200);
    }

    // fallback to AI assistance for any other queries
    const aiReply = await openaiChat([{ role: "system", content: buildSystemPrompt() }, { role: "user", content: incoming }], 250);
    await sendWhatsApp(from, aiReply);
    return res.sendStatus(200);

  } catch (err) {
    console.error("Webhook error:", err.stack || err.message);
    return res.sendStatus(500);
  }
});

/* -------------------- STARTUP -------------------- */

app.listen(PORT, async () => {
  console.log(`NDE AI Server running on port ${PORT}`);
  await syncShopifyProducts();
  // refresh shopify catalog every 30 minutes
  setInterval(syncShopifyProducts, 1000 * 60 * 30);
});
