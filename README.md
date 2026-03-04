# NDE AI WhatsApp Sales Assistant

Production-ready WhatsApp AI sales assistant for **ndestore.com** that handles customer inquiries, product searches, and sales conversations automatically.

---

# Stack

* Node.js
* Express
* OpenAI API
* Shopify Admin API
* Twilio WhatsApp API
* Railway Deployment

---

# Overview

The **NDE AI WhatsApp Sales Assistant** acts as a professional auto parts sales manager capable of handling hundreds of customer conversations daily.

The system performs:

* Customer conversation handling
* Vehicle detection
* Shopify product search
* AI-powered responses
* WhatsApp message automation
* Customer session memory

It is designed to support **high-volume e-commerce support operations**.

---

# Environment Variables

Configure the following environment variables in Railway.

```
OPENAI_API_KEY
SHOPIFY_STORE_DOMAIN
SHOPIFY_ADMIN_API_TOKEN
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_WHATSAPP_NUMBER
PORT
```

Example:

```
OPENAI_API_KEY=sk-xxxxx
SHOPIFY_STORE_DOMAIN=ndestore.myshopify.com
SHOPIFY_ADMIN_API_TOKEN=shpat_xxxxx
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
PORT=3000
```

---

# Webhook

The Twilio WhatsApp webhook must point to:

```
POST /webhook
```

Example production endpoint:

```
https://nde-ai-server-production.up.railway.app/webhook
```

---

# Features

## AI Vehicle Detection

The assistant automatically detects vehicle information such as:

* Vehicle make
* Vehicle model
* Model year

Example:

Customer message:

```
Cultus 2009 brake pad
```

AI identifies:

```
Vehicle: Suzuki Cultus
Year: 2009
```

and searches the Shopify catalog accordingly.

---

## Shopify Product Search

Products are retrieved using the **Shopify Admin API**.

The system can:

* search products
* detect product availability
* generate ndestore.com search links
* check inventory levels

Example generated link:

```
https://www.ndestore.com/search?q=Suzuki+Cultus+Brake+Pad&options%5Bprefix%5D=last
```

---

## WhatsApp Automatic Replies

The assistant replies automatically to customers using the **Twilio WhatsApp API**.

Supported conversation types:

* product inquiries
* vehicle compatibility
* pricing requests
* order guidance
* support queries

All responses remain:

* professional
* concise
* mobile-friendly

---

## Customer Session Memory

Each WhatsApp number is treated as a **customer session**.

Session memory tracks:

* chat history
* customer intent
* product searches
* order conversations

This enables contextual responses and better sales assistance.

---

## Professional Sales Responses

The AI is trained to behave as a **professional automotive parts sales representative**.

Response characteristics:

* polite tone
* concise messages
* product-focused responses
* conversion-driven suggestions

---

# Server Start

Run the server locally with:

```
npm install
npm start
```

The server will start on:

```
http://localhost:3000
```

---

# Deployment

The project is designed for deployment on **Railway**.

Steps:

1. Push repository to GitHub
2. Create a Railway project
3. Connect the repository
4. Configure environment variables
5. Deploy

Railway will automatically install dependencies and start the server.

---

# Production Considerations

Recommended production practices:

* Use Node.js version 20+
* Secure environment variables
* Monitor logs via Railway dashboard
* Enable automatic restarts

---

# License

Internal project for **ndestore.com**.
