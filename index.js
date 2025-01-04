import MyDebouncer from './debouncing-concepts/MyDebouncer.js';

// Create an instance of the debouncer
const debouncer = new MyDebouncer();

// Create a debounced function ONCE
const logMessage = debouncer.debounce((message) => {
    console.log(message);
}, 400);

// Simulate rapid calls
logMessage('First call'); // Ignored
logMessage('Second call'); // Should be ignored
setTimeout(() => logMessage('Final call'), 500); // Executes after 600ms
