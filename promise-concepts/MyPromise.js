
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

        try {
            executor(this.resolve, this.reject)
        } catch (err) {
            throw new Error(err)
        }
    }

    resolve = (value) => {
        console.log('resolve this>>> ', this);
        this.#state = STATE.FULFILLED;
        this.#value = value;
    }

    reject = (reason) => {
        this.#state = STATE.REJECTED;
        this.#value = reason;
    } 


    get state() {
        return this.#state;
    }

    get value() {
        return this.#value;
    }


}

export default MyPromise;


