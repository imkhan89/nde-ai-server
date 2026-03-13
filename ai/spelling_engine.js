function similarity(a,b){

a = a.toLowerCase()
b = b.toLowerCase()

let matches = 0

for(let i=0;i<a.length;i++){
if(b.includes(a[i])){
matches++
}
}

return matches / Math.max(a.length,b.length)

}

function findClosestWord(word, dictionary){

let bestMatch = word
let bestScore = 0

dictionary.forEach(item => {

const score = similarity(word,item)

if(score > bestScore){
bestScore = score
bestMatch = item
}

})

return bestMatch

}

function correctQuery(query){

const dictionary = [
"toyota","honda","suzuki","daihatsu",
"corolla","civic","city","cultus","swift","alto",
"air","filter","oil","brake","pads","rotor","plug"
]

const words = query.toLowerCase().split(" ")

const corrected = words.map(w => findClosestWord(w,dictionary))

return corrected.join(" ")

}

module.exports = {
correctQuery
}
