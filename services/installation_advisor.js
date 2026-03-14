export function installationAdvice(productType) {

    if (!productType) return "";

    const key = productType.toLowerCase();

    if (key.includes("wiper")) {

        return `Installation guidance:
Lift the wiper arm, remove the old blade from the clip and attach the new blade securely before lowering the arm.`;

    }

    if (key.includes("air filter")) {

        return `Installation guidance:
Open the air filter housing, remove the old filter and place the new filter in the same orientation before closing the housing.`;

    }

    return "";

}
