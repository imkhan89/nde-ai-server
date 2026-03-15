let chats = {};

export function storeMessage(phone, sender, message){

if(!chats[phone]){
chats[phone] = [];
}

chats[phone].push({
sender,
message,
time:Date.now()
});

}

export function getAllChats(){
return chats;
}

export function getChat(phone){
return chats[phone] || [];
}

export function getChatSummary(){

const summary = [];

for(const phone in chats){

summary.push({
phone,
messages:chats[phone].length,
lastMessage:chats[phone][chats[phone].length-1]
});

}

return summary;

}
