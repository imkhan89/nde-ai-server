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

app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())

const db = await open({
filename:"./nde.db",
driver:sqlite3.Database
})

await db.exec(`

CREATE TABLE IF NOT EXISTS customers(
id INTEGER PRIMARY KEY,
phone TEXT UNIQUE,
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
"wiper blade",
"brake pad",
"air filter",
"oil filter",
"cabin filter",
"spark plug",
"radiator cap",
"horn"
]

const shortLinks = {}

function normalize(text){

return text
.toLowerCase()
.replace(/[^a-z0-9 ]/g," ")
.replace(/\s+/g," ")
.trim()

}

function detectVehicle(text){

for(const v of vehicles){
if(text.includes(v)){
return v
}
}

return null

}

function detectPart(text){

for(const p of parts){
if(text.includes(p)){
return p
}
}

return null

}

function shorten(url){

const id = shortid.generate()

shortLinks[id] = url

return `${process.env.BASE_URL}/s/${id}`

}

async function searchProducts(part){

const rows = await db.all(
`SELECT * FROM products WHERE title LIKE ?`,
[`%${part}%`]
)

return rows.slice(0,3)

}

async function learn(phone,message){

await db.run(
`INSERT INTO conversations(phone,message) VALUES(?,?)`,
[phone,message]
)

}

async function saveLead(phone,vehicle,part){

await db.run(
`INSERT INTO leads(phone,vehicle,part) VALUES(?,?,?)`,
[phone,vehicle,part]
)

}

function buildResponse(products,vehicle,part){

if(products.length===0){

return `We could not find ${part} for ${vehicle}.

Our team will check availability and assist shortly.`

}

let msg = `Available ${part} for ${vehicle}:

`

for(const p of products){

co
