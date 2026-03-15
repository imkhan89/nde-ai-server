const contextDB = {};

export function getCustomerContext(phone) {

if (!contextDB[phone]) {
contextDB[phone] = {};
}

return contextDB[phone];

}

export function updateCustomerContext(phone, data) {

if (!contextDB[phone]) {
contextDB[phone] = {};
}

contextDB[phone] = {
...contextDB[phone],
...data
};

}

export function clearCustomerContext(phone) {

delete contextDB[phone];

}
