import EventEmitter from 'events';

export default class MyStream extends EventEmitter {
    #ended;
    #paused;
    #buffer;
    #bufferSize;
    #highWaterMark;

    constructor(highWaterMark = 16 * 1024) {
        super();
        this.#ended = false;
        this.#paused = false;
        this.#buffer = [];
        this.#bufferSize = 0;
        this.#highWaterMark = highWaterMark;
    }

    push(chunk) {
        if (chunk === null && !this.#ended) {
            this.#ended = true;
            this.emit('end')
            return;
        }

        if (this.#ended) {
            throw new Error('Cannot push after stream has ended');
        }

        const chunkByteSize = this.getChunkSize(chunk);

        if (this.#bufferSize + chunkByteSize > this.#highWaterMark || this.#paused) {
            this.#buffer.push(chunk);
            this.#bufferSize += chunkByteSize;
            return false;
        }

        this.emit('data', chunk);

        // Emit "drain" if buffer size drops below highWaterMark
        if (this.#bufferSize < this.#highWaterMark) {
            this.emit('drain');
        }

        return true;
    }


    pause() {
        this.#paused = true;
    }

    resume() {
        this.#paused = false;

        while (this.#buffer.length > 0) {
            const chunk = this.#buffer.shift();
            const chunkSize = this.getChunkSize(chunk);
            this.#bufferSize -= chunkSize;
            this.emit('data', chunk);

            // Emit "drain" if buffer size drops below highWaterMark
            if (this.#bufferSize < this.#highWaterMark) {
                this.emit('drain');
            }
        }
    }

    getChunkSize(chunk) {
        if (chunk === null) {
            return 0; // Explicitly handle null
        }
        const chunkType = typeof chunk;
        switch (chunkType) {
            case 'string':
                return Buffer.byteLength(chunk, 'utf8');
            case 'object':
                if (chunk instanceof Buffer) {
                    return chunk.length;
                }
                return Buffer.byteLength(JSON.stringify(chunk), 'utf8');
            case 'number':
            case 'boolean':
                return Buffer.byteLength(String(chunk), 'utf8');
            default:
                return 1;
        }
    }

    getBufferSize() {
        return this.#bufferSize;
    }

}