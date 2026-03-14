export function normalizeText(text){

return text
.toLowerCase()
.replace(/[^\w\s]/gi,"")
.trim()

}
