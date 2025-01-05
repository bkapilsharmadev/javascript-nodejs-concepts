export default class MyDebouncer {
    debounce (cb, delay) {
        let timer = null;
        return (...args) => {
            // Clear the previous timer
            clearTimeout(timer);

            // Set a new timer
            timer = setTimeout(() => {
                cb(...args); // Execute the callback with provided arguments
            }, delay);
        };
    };
}
