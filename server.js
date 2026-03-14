import express from "express"
import bodyParser from "body-parser"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import shortid from "shortid"
import twilio from "twilio"
import dotenv from "dotenv"

dotenv.config()

const { MessagingResponse } = twilio.twiml

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

const vehicles = [
  "corolla",
  "civic",
  "city",
  "cultus",
  "swift",
  "mehran",
  "yaris"
]

const parts = [
  "wiper",
