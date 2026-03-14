import express from "express"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import dotenv from "dotenv"

dotenv.config()

const app = express()

const db = await open({
  filename: "./nde.db",
  driver: sqlite3.Database
})

await db.exec(`
CREATE TABLE IF NOT EXISTS customers(
  id INTEGER PRIMARY KEY,
  phone TEXT UNIQUE,
  country TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations(
  id INTEGER PRIMARY KEY,
  phone TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads(
  id INTEGER PRIMARY KEY,
  phone TEXT,
  vehicle TEXT,
  part TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products(
  id INTEGER PRIMARY KEY,
  title TEXT,
  price REAL,
  url TEXT,
  sku TEXT
);

CREATE TABLE IF NOT EXISTS orders(
  id INTEGER PRIMARY KEY,
  order_number TEXT,
  phone TEXT,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints(
  id INTEGER PRIMARY KEY,
  phone TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)

app.get("/", (req,res)=>{
  res.send("NDE AI Admin Server Running")
})

app.get("/stats", async (req,res)=>{

  const customers = await db.get(`SELECT COUNT(*) as total FROM customers`)
  const conversations = await db.get(`SELECT COUNT(*) as total FROM conversations`)
  const leads = await db.get(`SELECT COUNT(*) as total FROM leads`)
  const products = await db.get(`SELECT COUNT(*) as total FROM products`)
  const orders = await db.get(`SELECT COUNT(*) as total FROM orders`)
  const complaints = await db.get(`SELECT COUNT(*) as total FROM complaints`)

  res.json({
    customers: customers.total,
    conversations: conversations.total,
    leads: leads.total,
    products: products.total,
    orders: orders.total,
    complaints: complaints.total
  })

})

app.get("/customers", async (req,res)=>{
  const rows = await db.all(`
  SELECT * FROM customers
  ORDER BY created_at DESC
  LIMIT 200`)
  res.json(rows)
})

app.get("/conversations", async (req,res)=>{
  const rows = await db.all(`
  SELECT * FROM conversations
  ORDER BY created_at DESC
  LIMIT 500`)
  res.json(rows)
})

app.get("/leads", async (req,res)=>{
  const rows = await db.all(`
  SELECT * FROM leads
  ORDER BY created_at DESC`)
  res.json(rows)
})

app.get("/products", async (req,res)=>{
  const rows = await db.all(`
  SELECT * FROM products
  ORDER BY id DESC
  LIMIT 200`)
  res.json(rows)
})

app.get("/orders", async (req,res)=>{
  const rows = await db.all(`
  SELECT * FROM orders
  ORDER BY created_at DESC`)
  res.json(rows)
})

app.get("/complaints", async (req,res)=>{
  const rows = await db.all(`
  SELECT * FROM complaints
  ORDER BY created_at DESC`)
  res.json(rows)
})

const PORT = 4000

app.listen(PORT, ()=>{
  console.log("Admin server running on port", PORT)
})
