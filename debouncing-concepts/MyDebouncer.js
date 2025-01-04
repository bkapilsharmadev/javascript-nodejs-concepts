export default class MyDebouncer {
    #timer;

    constructor() {
        this.#timer = null;
    }

    debounce = (cb, delay) => {
        return (...args) => {
            // Clear the previous timer
            clearTimeout(this.#timer);

            // Set a new timer
            this.#timer = setTimeout(() => {
                cb(...args); // Execute the callback with provided arguments
            }, delay);
        };
    };
}
