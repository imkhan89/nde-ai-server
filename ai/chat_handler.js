const correctSpelling = require("./spelling_intelligence_engine")
const parseAutoParts = require("./auto_parts_parser")
const buildSearchQuery = require("./search_query_builder")
const buildPartsResponse = require("./response_builder")

function handleChat(message){

if(!message) return null

/* SPELLING CORRECTION */

const corrected = correctSpelling(message)

/* PARSE QUERY */

const parsed = parseAutoParts(corrected)

if(!parsed) return null

/* BUILD SEARCH */

const search = buildSearchQuery(parsed)

/* BUILD RESPONSE */

return buildPartsResponse(search)

}

module.exports = handleChat
