export default class MyEventEmitter {
    #events;

    constructor() {
        this.#events = {}
    }

    on(eventName, cb) {
        if (!this.#events[eventName]) {
            this.#events[eventName] = [];
        }

        this.#events[eventName].push(cb)

        console.log(this.#events)
    }

    emit(eventName, ...args) {
        const listeners = this.#events[eventName];

        if (listeners) {
            listeners.forEach(listener => listener(...args));
        }
    }

    once(eventName, cb) {
        const listeners = this.#events[eventName] || [];

        const exists = listeners.some(listener => listener.original === cb);
        if (exists) return;

        const wrapperFn = (...args) => {
            cb(...args);
            this.off(eventName, wrapperFn);
        }

        wrapperFn.original = cb;
        this.on(eventName, wrapperFn);
    }

    off(eventName, cb) {
        const listeners = this.#events[eventName];

        if (listeners) {
            this.#events = listeners.filter(listener => listener != cb);
        }
    }
}