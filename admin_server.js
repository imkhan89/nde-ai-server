import express from "express"
import sqlite3 from "sqlite3"
import { open } from "sqlite"

const app = express()

const db = await open({
  filename: "./nde.db",
  driver: sqlite3.Database
})

app.get("/", (req,res)=>{
  res.send("NDE AI Admin Running")
})

app.get("/stats", async (req,res)=>{

  const customers = await db.get(
    `SELECT COUNT(*) as total FROM customers`
  )

  const conversations = await db.get(
    `SELECT COUNT(*) as total FROM conversations`
  )

  const leads = await db.get(
    `SELECT COUNT(*) as total FROM leads`
  )

  const products = await db.get(
    `SELECT COUNT(*) as total FROM products`
  )

  const orders = await db.get(
    `SELECT COUNT(*) as total FROM orders`
  )

  res.json({
    customers: customers.total,
    conversations: conversations.total,
    leads: leads.total,
    products: products.total,
    orders: orders.total
  })

})

app.get("/customers", async (req,res)=>{

  const rows = await db.all(
    `SELECT * FROM customers ORDER BY created_at DESC LIMIT 200`
  )

  res.json(rows)

})

app.get("/conversations", async (req,res)=>{

  const rows = await db.all(
    `SELECT * FROM conversations ORDER BY created_at DESC LIMIT 500`
  )

  res.json(rows)

})

app.get("/leads", async (req,res)=>{

  const rows = await db.all(
    `SELECT * FROM leads ORDER BY created_at DESC`
  )

  res.json(rows)

})

app.get("/products", async (req,res)=>{

  const rows = await db.all(
    `SELECT * FROM products ORDER BY id DESC LIMIT 200`
  )

  res.json(rows)

})

app.get("/orders", async (req,res)=>{

  const rows = await db.all(
    `SELECT * FROM orders ORDER BY created_at DESC`
  )

  res.json(rows)

})

const PORT = 4000

app.listen(PORT, ()=>{
  console.log("Admin server running on port", PORT)
})
