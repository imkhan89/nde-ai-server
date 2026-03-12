function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[,+]/g," ")
.replace(/[^\w\s]/g," ")
.replace(/\s+/g," ")
.trim()

}

function detectYear(tokens){

for(const t of tokens){

if(/^(19|20)\d{2}$/.test(t)){
return t
}

}

return ""

}

function extract(tokens,year){

const words = tokens.filter(t => t !== year)

let part = ""
let make = ""
let model = ""

if(words.length >= 3){

part = words.slice(0,words.length-2).join(" ")
make = words[words.length-2]
model = words[words.length-1]

}

if(words.length === 2){

part = words[0]
make = words[1]

}

return {part,make,model}

}

function buildQuery(part,make,model,year){

if(year){
return `${part} for ${make} ${model} ${year}`
}

return `${part} for ${make} ${model}`

}

function buildURL(query){

return "https://www.ndestore.com/search?q=" +
encodeURIComponent(query)

}

function parseAutoParts(message){

if(!message) return null

const clean = normalize(message)

const tokens = clean.split(" ")

if(tokens.length < 2) return null

const year = detectYear(tokens)

const {part,make,model} = extract(tokens,year)

if(!part || !make){
return null
}

const query = buildQuery(part,make,model,year)

const url = buildURL(query)

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
