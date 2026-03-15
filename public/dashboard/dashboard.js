async function loadChats(){

const res = await fetch("/dashboard/chats");

const chats = await res.json();

const sidebar = document.getElementById("sidebar");

sidebar.innerHTML="";

chats.forEach(c=>{

const div = document.createElement("div");

div.className="chatUser";

div.innerText=c.phone;

div.onclick=()=>loadConversation(c.phone);

sidebar.appendChild(div);

});

}

async function loadConversation(phone){

const res = await fetch("/dashboard/chat/"+phone);

const messages = await res.json();

const chat = document.getElementById("chatWindow");

chat.innerHTML="";

messages.forEach(m=>{

const msg = document.createElement("div");

msg.className="msg "+m.sender;

msg.innerText=m.sender+": "+m.message;

chat.appendChild(msg);

});

}

loadChats();

setInterval(loadChats,3000);
