export function generateSalesAdvice(products) {

    if (!products || products.length === 0) {
        return "";
    }

    let advice = "";

    const topProduct = products[0];

    if (topProduct.title.toLowerCase().includes("denso")) {

        advice = "Denso is generally considered a highly reliable and durable option.";

    }

    if (topProduct.title.toLowerCase().includes("bosch")) {

        advice = "Bosch offers strong performance and good value.";

    }

    return advice;

}
