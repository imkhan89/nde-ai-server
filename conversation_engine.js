const sessionManager = require("./sessions/sessionManager");

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
`;

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
`;

const ACCESSORIES_MENU = `
2 Car Accessories

Please describe the accessory you require.

Example:
Floor Mat Suzuki Swift

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288
`;

const STICKER_MENU = `
3 Sticker Decals

1 Sticker Collection
2 Sticker Themes
3 Customized Stickers

Reply with 1, 2, or 3 to continue.

For a Live Agent:
WhatsApp +92 308 7643288
`;

const ORDER_STATUS_MENU = `
4 Order Status

Kindly share the following:

Order ID:

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288
`;

const CHAT_SUPPORT_MENU = `
5 Chat Support

Please write your query and our AI assistant will help you.

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288
`;

const COMPLAINT_MENU = `
6 Complaints

Kindly share the following:

Order ID:
Describe the Issue:

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288
`;

function conversationEngine(message, from) {

if (!message) {
return { reply: MAIN_MENU };
}

const text = message.trim().toLowerCase();

let session = sessionManager.getSession(from);

/* CREATE SESSION */

if (!session) {
sessionManager.createSession(from, "MAIN_MENU");
return { reply: MAIN_MENU };
}

/* RETURN TO MAIN MENU */

if (text === "#") {
sessionManager.updateSession(from, "MAIN_MENU");
return { reply: MAIN_MENU };
}

/* MAIN MENU STATE */

if (session.state === "MAIN_MENU") {

if (text === "1") {
sessionManager.updateSession(from, "AUTO_PARTS");
return { reply: AUTO_PARTS_MENU };
}

if (text === "2") {
sessionManager.updateSession(from, "ACCESSORIES");
return { reply: ACCESSORIES_MENU };
}

if (text === "3") {
sessionManager.updateSession(from, "STICKERS");
return { reply: STICKER_MENU };
}

if (text === "4") {
sessionManager.updateSession(from, "ORDER_STATUS");
return { reply: ORDER_STATUS_MENU };
}

if (text === "5") {
sessionManager.updateSession(from, "CHAT_SUPPORT");
return { reply: CHAT_SUPPORT_MENU };
}

if (text === "6") {
sessionManager.updateSession(from, "COMPLAINT");
return { reply: COMPLAINT_MENU };
}

return { reply: MAIN_MENU };

}

/* ACCESSORIES STATE */

if (session.state === "ACCESSORIES") {

return {
reply:
`Accessory request received.

Our team is reviewing your request.

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`
};

}

/* STICKERS STATE */

if (session.state === "STICKERS") {

if (text === "1") {
return {
reply:
`Kindly visit the following website link:
https://www.ndestore.com/collections/stickers-decal

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`
};
}

if (text === "2") {
return {
reply:
`Sticker Themes

1 Army Sticker
2 Advocate Sticker
3 Doctor Sticker
4 Door Sill Sticker
5 Firearm Sticker
6 Honda Sticker
7 Hunter Sticker
8 Jeep Sticker
9 Laptop Sticker
10 Markhor Sticker
11 Sports Mind Sticker
12 Toyota Sticker
13 Toyota GR Sticker
14 Toyota TEQ Sticker

Reply with 1–14 to continue.

For a Live Agent:
WhatsApp +92 308 7643288`
};
}

if (text === "3") {
return {
reply:
`Customized Stickers

Kindly visit the following website link:

https://www.ndestore.com/pages/custom-decal-and-sticker

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`
};
}

}

/* ORDER STATUS STATE */

if (session.state === "ORDER_STATUS") {

return {
reply:
`Order ID received. Our system will verify the order.

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`
};

}

/* CHAT SUPPORT STATE */

if (session.state === "CHAT_SUPPORT") {

return {
reply:
`Our AI support assistant is reviewing your query.

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`
};

}

/* COMPLAINT STATE */

if (session.state === "COMPLAINT") {

return {
reply:
`Thank you for your submission. Our team will review your complaint.

A complaint ticket will be issued shortly.

Reply # to return to the Main Menu.

For a Live Agent:
WhatsApp +92 308 7643288`
};

}

/* FALLBACK */

return { reply: MAIN_MENU };

}

module.exports = conversationEngine;
