const fs = require("fs")

const path = "./data/parts_dictionary.json"

let raw = fs.readFileSync(path,"utf8")

const matches = raw.match(/"([^"]+)"/g) || []

const parts = matches.map(v=>v.replace(/"/g,"").trim())

const unique = [...new Set(parts)].sort()

fs.writeFileSync(
path,
JSON.stringify(unique,null,2)
)

console.log("dictionary rebuilt:",unique.length)
