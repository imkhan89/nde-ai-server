/*
AI Learning Engine
Tracks customer queries and improves system intelligence
*/

const fs = require("fs")
const path = require("path")

const DATA_FILE = path.join(__dirname,"../data/query_learning.json")

let memory = {}

/* LOAD MEMORY */

function load(){

try{

if(fs.existsSync(DATA_FILE)){

const raw = fs.readFileSync(DATA_FILE,"utf8")

memory = JSON.parse(raw || "{}")

}

}catch(e){

memory = {}

}

}

load()

/* SAVE MEMORY */

function save(){

try{

fs.writeFileSync(DATA_FILE,JSON.stringify(memory,null,2))

}catch(e){}

}

/* RECORD QUERY */

function learn(query){

if(!query) return

const key = query.toLowerCase().trim()

if(!memory[key]){

memory[key] = {
count:0,
lastUsed:Date.now()
}

}

memory[key].count += 1
memory[key].lastUsed = Date.now()

save()

}

/* GET TRENDING */

function getTrending(limit=10){

const arr = Object.entries(memory)

arr.sort((a,b)=> b[1].count - a[1].count)

return arr.slice(0,limit).map(x=>({

query:x[0],
count:x[1].count

}))

}

module.exports = {

learn,
getTrending

}
