import express from "express"
import bodyParser from "body-parser"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import axios from "axios"
import shortid from "shortid"
import { MessagingResponse } from "twilio/lib/twiml/MessagingResponse.js"

const app = express()

app.use(bodyParser.urlencoded({extended:false}))
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

return `https://ndestore.com/s/${id}`

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

function buildResponse(products,vehicle,part){

if(products.length===0){

return `We could not find ${part} for ${vehicle}.

Our team will assist shortly.`

}

let msg = `Available ${part} for ${vehicle}:

`

for(const p of products){

const short = shorten(p.url)

msg += `${p.title}
PKR ${p.price}
${short}

`

}

return msg

}

async function processMessage(message,phone){

const text = normalize(message)

const vehicle = detectVehicle(text)
const part = detectPart(text)

await learn(phone,message)

if(!part){

return `Please share which part you need.

Example:
Brake Pad
Oil Filter
Wiper Blade`

}

if(!vehicle){

return `Please share vehicle details.

Example:
Toyota Corolla 2018`

}

const products = await searchProducts(part)

return buildResponse(products,vehicle,part)

}

app.get("/",(req,res)=>{
res.send("NDE Automotive AI Running")
})

app.get("/s/:id",(req,res)=>{

const id = req.params.id

if(shortLinks[id]){

res.redirect(shortLinks[id])

}else{

res.send("Invalid link")

}

})

app.post("/whatsapp",async(req,res)=>{

const message = req.body.Body || ""
const phone = req.body.From || ""

await db.run(
`INSERT OR IGNORE INTO customers(phone) VALUES(?)`,
[phone]
)

const reply = await processMessage(message,phone)

const twiml = new MessagingResponse()

twiml.message(reply)

res.writeHead(200,{'Content-Type':'text/xml'})
res.end(twiml.toString())

})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
console.log("Server running on port",PORT)
})
