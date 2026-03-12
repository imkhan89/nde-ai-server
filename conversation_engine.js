const parseAutoParts = require("./ai/auto_parts_parser")
const sessionManager = require("./sessions/sessionManager")

const MAIN_MENU = `
Welcome to ndestore.com AI Support. Please choose an option:

1 Auto Parts
2 Car Accessories
3 Sticker Decals
4 Order Status
5 Chat Support
6 Complaints

Reply with 1, 2, 3, 4, 5, or 6 to continue.

For a Live Agent:
WhatsApp +92 308 7643288
`

const AUTO_PARTS_MENU = `
1 Auto Parts

Parts Inquiry, Please share the following details:

Part Description: (e.g. Air Filter)
Vehicle Make: (e.g. Suzuki)
Vehicle Model: (e.g. Swift)
Model Year: (e.g. 2021)

Or send in this format:

Part + Make + Model + Year

Example:
Air Filter Suzuki Swift 2021

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288
`

function conversationEngine(message, from){

if(!message){
return { reply: MAIN_MENU }
}

const text = message.trim().toLowerCase()

let session = sessionManager.getSession(from)

/* CREATE SESSION */

if(!session){

sessionManager.createSession(from,"MAIN_MENU")
session = sessionManager.getSession(from)

}

/* RESET */

if(text === "#"){

sessionManager.updateSession(from,"MAIN_MENU")
return { reply: MAIN_MENU }

}

/* MAIN MENU */

if(session.state === "MAIN_MENU"){

if(text === "1"){

sessionManager.updateSession(from,"AUTO_PARTS")
return { reply: AUTO_PARTS_MENU }

}

if(text === "2"){

return {
reply:
`2 Car Accessories

Please describe the accessory you require.

Example:
Floor Mat Suzuki Swift

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`
}

}

if(text === "3"){

return {
reply:
`3 Sticker Decals

1 Sticker Collection
2 Sticker Themes
3 Customized Stickers

Reply with 1, 2, or 3 to continue.

For a Live Agent:
WhatsApp +92 308 7643288`
}

}

if(text === "4"){

sessionManager.updateSession(from,"ORDER_STATUS")

return {
reply:
`4 Order Status

Kindly share the following:

Order ID:

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`
}

}

if(text === "5"){

sessionManager.updateSession(from,"CHAT_SUPPORT")

return {
reply:
`5 Chat Support

Please write your query and our AI assistant will help you.

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`
}

}

if(text === "6"){

sessionManager.updateSession(from,"COMPLAINT")

return {
reply:
`6 Complaints

Kindly share the following:

Order ID:
Describe the Issue:

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`
}

}

return { reply: MAIN_MENU }

}

/* AUTO PARTS */

if(session.state === "AUTO_PARTS"){

const parsed = parseAutoParts(message)

if(!parsed){

return { reply: AUTO_PARTS_MENU }

}

return {

reply:
`Part Description: ${parsed.part}
Vehicle Make: ${parsed.make}
Vehicle Model: ${parsed.model}
Model Year: ${parsed.year || "Not Provided"}

Kindly visit the following URL:
${parsed.url}

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`

}

}

return { reply: MAIN_MENU }

}

module.exports = conversationEngine
