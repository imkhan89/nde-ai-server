export async function saveConversation(db, phone, message, direction){

await db.run(
"INSERT INTO conversations(phone,message,direction) VALUES(?,?,?)",
[phone,message,direction]
)

}

export async function saveLead(db, phone, query){

await db.run(
"INSERT INTO leads(phone,query) VALUES(?,?)",
[phone,query]
)

}
