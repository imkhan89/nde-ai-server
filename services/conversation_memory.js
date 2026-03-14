// services/conversation_memory.js

const conversationStore = new Map();

function createEmptySession() {
    return {
        vehicle: null,
        product: null,
        lastQuery: null,
        lastResults: []
    };
}

export function getSession(sessionId) {

    if (!sessionId) return createEmptySession();

    if (!conversationStore.has(sessionId)) {
        conversationStore.set(sessionId, createEmptySession());
    }

    return conversationStore.get(sessionId);
}

export function updateVehicle(sessionId, vehicle) {

    if (!sessionId || !vehicle) return;

    const session = getSession(sessionId);

    session.vehicle = vehicle;

    conversationStore.set(sessionId, session);
}

export function updateProduct(sessionId, product) {

    if (!sessionId || !product) return;

    const session = getSession(sessionId);

    session.product = product;

    conversationStore.set(sessionId, session);
}

export function updateSearchResults(sessionId, results) {

    if (!sessionId) return;

    const session = getSession(sessionId);

    session.lastResults = results || [];

    conversationStore.set(sessionId, session);
}

export function updateLastQuery(sessionId, query) {

    if (!sessionId) return;

    const session = getSession(sessionId);

    session.lastQuery = query;

    conversationStore.set(sessionId, session);
}

export function clearSession(sessionId) {

    if (!sessionId) return;

    conversationStore.delete(sessionId);
}
