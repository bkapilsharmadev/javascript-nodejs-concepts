export default class MyEventEmitter {
    #events;

    constructor() {
        this.#events = {}
    }

    on(eventName, cb) {
        if(!this.#events[eventName]) {
            this.#events[eventName] = [];
        }

        this.#events[eventName].push(cb)
    }

    emit(eventName, ...args) {
        const listeners = this.#events[eventName];

        if(listeners) {
            listeners.forEach(listener =>  listener(...args));
        }
    }
}