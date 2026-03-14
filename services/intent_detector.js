// services/intent_detector.js

export function detectIntent(message) {

    if (!message || typeof message !== "string") {
        return {
            price: false,
            availability: false,
            technical: false,
            installation: false,
            greeting: false,
            recommendation: false
        };
    }

    const text = message.toLowerCase();

    const intent = {
        price: false,
        availability: false,
        technical: false,
        installation: false,
        greeting: false,
        recommendation: false
    };

    const greetingWords = [
        "hi",
        "hello",
        "salam",
        "assalam",
        "hey"
    ];

    const priceWords = [
        "price",
        "cost",
        "rate",
        "how much",
        "charges"
    ];

    const stockWords = [
        "available",
        "availability",
        "in stock",
        "do you have"
    ];

    const technicalWords = [
        "size",
        "inch",
        "mm",
        "dimension",
        "weight",
        "spec",
        "specification"
    ];

    const installWords = [
        "install",
        "installation",
        "how to install",
        "how to use",
        "fitting",
        "fit"
    ];

    const recommendWords = [
        "which is best",
        "best option",
        "recommend",
        "suggest",
        "better",
        "good option"
    ];

    for (const word of greetingWords) {
        if (text.includes(word)) intent.greeting = true;
    }

    for (const word of priceWords) {
        if (text.includes(word)) intent.price = true;
    }

    for (const word of stockWords) {
        if (text.includes(word)) intent.availability = true;
    }

    for (const word of technicalWords) {
        if (text.includes(word)) intent.technical = true;
    }

    for (const word of installWords) {
        if (text.includes(word)) intent.installation = true;
    }

    for (const word of recommendWords) {
        if (text.includes(word)) intent.recommendation = true;
    }

    return intent;
}
