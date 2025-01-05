import MyStream from './stream-concepts/MyStream.js';

const myStream = new MyStream();

// Add a listener for "data"
myStream.on('data', (chunk) => {
    console.log('Data received:', chunk);
});

// Add a listener for "end"
myStream.on('end', () => {
    console.log('Stream ended');
});

// Push some data
myStream.push('chunk1');
myStream.push('chunk2');

// Pause the stream
myStream.pause();

// Push data while paused
myStream.push('chunk3');
myStream.push('chunk4');

// Resume the stream after a delay
setTimeout(() => {
    console.log('Resuming the stream...');
    myStream.resume();
}, 2000);

// End the stream
setTimeout(() => {
    myStream.push(null);
}, 3000);
