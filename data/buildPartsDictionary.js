const fs=require("fs")

const products=JSON.parse(fs.readFileSync("./products.json"))

let parts=new Set()

const partPatterns=[
"oil filter",
"air filter",
"cabin filter",
"fuel filter",
"spark plug",
"brake pad",
"brake rotor",
"brake shoe",
"radiator cap",
"coolant",
"wiper blade",
"horn",
"floor mat",
"sun shade",
"engine shield",
"fender shield",
"bumper",
"emblem",
"monogram",
"decal"
]

for(const p of products){

const title=p.title.toLowerCase()

for(const part of partPatterns){

if(title.includes(part)){

parts.add(part)

}

}

}

fs.writeFileSync(
"./parts_dictionary.json",
JSON.stringify([...parts],null,2)
)

console.log("Parts dictionary generated")
