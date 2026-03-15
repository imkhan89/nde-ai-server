export function buildProductReply(products){

if(!products || products.length === 0){

return "Sorry, we could not find the product. Please send your vehicle model and part name.";

}

let message = "Here are the best options:\n\n";

products.slice(0,3).forEach((p,i)=>{

message += `${i+1}️⃣ ${p.title}\n`;
message += `Price: PKR ${p.price}\n`;
message += `Order: https://ndestore.com/products/${p.handle}\n\n`;

});

message += "Reply with product number to order.";

return message;

}
