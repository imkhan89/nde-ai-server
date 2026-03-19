function parseUserQuery(text) {
    text = text.toLowerCase();

    const MAKES = ["honda","toyota","suzuki","daihatsu","nissan","kia","hyundai"];
    const MODELS = ["civic","city","corolla","yaris","alto","cultus","mira","vitz","revo"];

    let make = "";
    let model = "";
    let year = "";
    let part = "";

    for (let m of MAKES) {
        if (text.includes(m)) make = m;
    }

    for (let m of MODELS) {
        if (text.includes(m)) model = m;
    }

    const yearMatch = text.match(/20\d{2}/);
    if (yearMatch) year = parseInt(yearMatch[0]);

    part = text
        .replace(make, "")
        .replace(model, "")
        .replace(year, "")
        .trim();

    return { part, make, model, year };
}

module.exports = { parseUserQuery };
