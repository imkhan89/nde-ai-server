function normalize(text){

return (text || "")
.toLowerCase()
.replace(/[^a-z0-9\- ]/g," ")
.replace(/\s+/g," ")
.trim()

}

function detectYear(text){

const t = normalize(text)

const yearMatch = t.match(/\b(19|20)\d{2}\b/)

if(yearMatch){
return parseInt(yearMatch[0])
}

return null

}

function parseYearRange(yearText){

if(!yearText) return []

const clean = normalize(yearText)

if(clean.includes("-")){

const parts = clean.split("-")

const start = parseInt(parts[0])
const end = parseInt(parts[1])

if(!isNaN(start) && !isNaN(end)){

let years = []

for(let y=start;y<=end;y++){
years.push(y)
}

return years

}

}

const single = parseInt(clean)

if(!isNaN(single)){
return [single]
}

return []

}

function matchYear(customerYear,shopifyYear){

if(!shopifyYear) return true

const years = parseYearRange(shopifyYear)

if(years.length === 0) return true

if(!customerYear) return true

return years.includes(parseInt(customerYear))

}

module.exports = {
detectYear,
parseYearRange,
matchYear
}
