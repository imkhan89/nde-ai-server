export function parseProductAttributes(productTitle) {

    const attributes = {};

    const title = productTitle.toLowerCase();

    if (title.includes("denso")) attributes.brand = "Denso";
    if (title.includes("bosch")) attributes.brand = "Bosch";
    if (title.includes("ngk")) attributes.brand = "NGK";

    if (title.includes("premium")) attributes.quality = "premium";
    if (title.includes("genuine")) attributes.quality = "genuine";

    return attributes;

}
