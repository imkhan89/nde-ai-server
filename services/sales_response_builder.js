// services/sales_response_builder.js

export function buildGreetingResponse() {

    return `Welcome to NDE Store.

We supply genuine and high quality automotive parts across Pakistan.

Please send the following details so we can assist you:

• Vehicle make
• Model
• Year
• Required part

Example:
Toyota Corolla 2018 brake pads`;

}


export function buildRecommendationResponse(vehicle, product, products) {

    let response = "";

    if (vehicle && vehicle.make && vehicle.model) {

        response += `Vehicle identified:\n`;
        response += `${vehicle.make} ${vehicle.model}`;

        if (vehicle.year) {
            response += ` ${vehicle.year}`;
        }

        response += `\n\n`;

    }

    if (product) {

        response += `Requested part:\n`;
        response += `${product}\n\n`;

    }

    if (products && products.length > 0) {

        response += `Recommended options available at ndestore.com:\n\n`;

        products.slice(0, 5).forEach((p, index) => {
            response += `${index + 1}. ${p.title}\n`;
        });

        response += `\n`;

        response += `If you prefer, we can also suggest:\n`;
        response += `• Original manufacturer brand\n`;
        response += `• OEM quality option\n`;
        response += `• Budget friendly option\n\n`;

        response += `Let us know your preference and we will assist further.`;

    } else {

        response += `We could not find matching products yet.\n`;
        response += `Please confirm your vehicle details so we can provide the correct part.\n`;

    }

    return response;

}


export function buildPriceResponse(products) {

    let response = "";

    if (!products || products.length === 0) {
        return `Please confirm the vehicle details so we can provide the correct product and price.`;
    }

    response += `Available options and pricing:\n\n`;

    products.slice(0, 5).forEach((p, index) => {

        response += `${index + 1}. ${p.title}\n`;

    });

    response += `\nFor current pricing and order confirmation, please let us know which option you prefer.`;

    return response;

}


export function buildAvailabilityResponse(products) {

    if (!products || products.length === 0) {

        return `Please confirm vehicle details so we can check the correct part availability.`;

    }

    let response = `The following options are available at ndestore.com:\n\n`;

    products.slice(0, 5).forEach((p, index) => {

        response += `${index + 1}. ${p.title}\n`;

    });

    response += `\nThese items can be delivered nationwide.`;

    return response;

}


export function buildTechnicalResponse(intent, fitment, product) {

    let response = "";

    if (intent.technical && fitment) {

        if (product && product.toLowerCase().includes("wiper") && fitment.wiper) {

            response += `Technical information:\n`;
            response += `Driver side: ${fitment.wiper.driver}\n`;
            response += `Passenger side: ${fitment.wiper.passenger}\n\n`;

        }

    }

    if (intent.installation) {

        response += `Installation guidance:\n`;
        response += `Turn off the vehicle before replacing the part.\n`;
        response += `Remove the existing component carefully and install the new one using the original mounting points.\n`;
        response += `If unsure, professional installation is recommended.\n`;

    }

    return response;

}
