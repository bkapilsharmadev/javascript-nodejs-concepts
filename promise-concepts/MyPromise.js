
const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
}

class MyPromise {
    #state;
    #value;

    constructor(executor) {
        this.#state = STATE.PENDING;
        this.#value = undefined;

        const resolve = (value) => {
            this.#state = STATE.FULFILLED;
            this.#value = value;
        }

        const reject = (reason) => {
            this.#state = STATE.REJECTED;
            this.#value = reason;
        }

        try {
            executor(resolve, reject)
        } catch(err) {
            throw new Error(err)
        }
    }

    get state() {
        return this.#state;
    }

    get value() {
        return this.#value;
    }

    
}

module.exports = MyPromise;


