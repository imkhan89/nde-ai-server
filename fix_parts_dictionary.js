const fs = require("fs")

const path = "./data/parts_dictionary.json"

let raw = fs.readFileSync(path,"utf8")

/* try to repair common issues */

raw = raw
.replace(/\r/g,"")
.replace(/\n/g,"")
.replace(/,,+/g,",")
.replace(/,\]/g,"]")

/* extract strings safely */

const matches = raw.match(/"([^"]+)"/g) || []

const parts = matches.map(v => v.replace(/"/g,"").trim())

/* remove duplicates */

const unique = [...new Set(parts)]

/* rebuild clean json */

fs.writeFileSync(
path,
JSON.stringify(unique,null,2)
)

console.log("parts_dictionary.json repaired")
console.log("total parts:",unique.length)
