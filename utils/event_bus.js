/*
NDE Automotive AI
Event Bus
*/

class EventBus {

  constructor() {

    this.events = new Map();

  }

  on(event, handler) {

    if (!this.events.has(event)) {

      this.events.set(event, []);

    }

    this.events.get(event).push(handler);

  }

  emit(event, payload) {

    const handlers = this.events.get(event);

    if (!handlers) return;

    for (const handler of handlers) {

      try {

        handler(payload);

      } catch (err) {

        console.error("Event handler error:", err);

      }

    }

  }

  off(event, handler) {

    const handlers = this.events.get(event);

    if (!handlers) return;

    const index = handlers.indexOf(handler);

    if (index !== -1) {

      handlers.splice(index, 1);

    }

  }

}

export const eventBus = new EventBus();
