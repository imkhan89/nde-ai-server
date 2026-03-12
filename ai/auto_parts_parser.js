function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[,+]/g," ")
.replace(/\s+/g," ")
.trim()

}

function parseAutoParts(message){

if(!message) return null

const clean = normalize(message)

const tokens = clean.split(" ")

if(tokens.length < 2){
return null
}

let part = ""
let make = ""
let model = ""
let year = ""

/* DETECT YEAR */

for(const t of tokens){

if(/^(19|20)\d{2}$/.test(t)){
year = t
}

}

const words = tokens.filter(t => t !== year)

if(words.length >= 3){

part = words.slice(0,words.length-2).join(" ")
make = words[words.length-2]
model = words[words.length-1]

}

if(words.length === 2){

part = words[0]
make = words[1]

}

if(!part || !make){
return null
}

const query = year
? `${part} for ${make} ${model} ${year}`
: `${part} for ${make} ${model}`

const url =
`https://www.ndestore.com/search?q=` +
encodeURIComponent(query)

return {

part,
make,
model,
year,
query,
url

}

}

module.exports = parseAutoParts
