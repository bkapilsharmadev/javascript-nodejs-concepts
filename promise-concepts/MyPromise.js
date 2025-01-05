const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
};

class MyPromise {
    #state;
    #value;
    #thenCbs = [];
    #catchCbs = [];

    constructor(executor) {
        this.#state = STATE.PENDING;
        this.#value = undefined;

        try {
            executor(this.resolve, this.reject);
        } catch (err) {
            this.reject(err);
        }
    }

    resolve = (value) => {
        if (this.#state !== STATE.PENDING) return;
        this.#state = STATE.FULFILLED;
        this.#value = value;

        queueMicrotask(() => {
            this.#thenCbs.forEach((cb) => cb(value));
        });
    };

    reject = (reason) => {
        if (this.#state !== STATE.PENDING) return;
        this.#state = STATE.REJECTED;
        this.#value = reason;

        queueMicrotask(() => {
            this.#catchCbs.forEach((cb) => cb(reason));
        });
    };

    then = (onFulfilled, onRejected) => {
        return new MyPromise((resolve, reject) => {
            const handleFulfill = () => {
                try {
                    if (typeof onFulfilled === 'function') {
                        const result = onFulfilled(this.#value);
                        if (result instanceof MyPromise) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } else {
                        resolve(this.#value);
                    }
                } catch (err) {
                    reject(err);
                }
            };

            const handleReject = () => {
                try {
                    if (typeof onRejected === 'function') {
                        const result = onRejected(this.#value);
                        if (result instanceof MyPromise) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } else {
                        reject(this.#value);
                    }
                } catch (err) {
                    reject(err);
                }
            };

            if (this.#state === STATE.FULFILLED) {
                queueMicrotask(handleFulfill);
            } else if (this.#state === STATE.REJECTED) {
                queueMicrotask(handleReject);
            } else {
                this.#thenCbs.push(handleFulfill);
                this.#catchCbs.push(handleReject);
            }
        });
    };

    catch = (onRejected) => {
        return this.then(null, onRejected);
    }

    finally = (callback) => {
        return new MyPromise((resolve, reject) => {
            const onFinally = () => {
                try {
                    callback(); // Execute the callback
                    if (this.#state === STATE.FULFILLED) {
                        resolve(this.#value); // Pass the original value
                    } else if (this.#state === STATE.REJECTED) {
                        reject(this.#value); // Pass the original reason
                    }
                } catch (err) {
                    reject(err); // Reject if callback throws
                }
            };

            if (this.#state === STATE.PENDING) {
                this.#thenCbs.push(onFinally);
                this.#catchCbs.push(onFinally);
            } else {
                queueMicrotask(onFinally);
            }
        });
    }

    // Getters for testing
    get state() {
        return this.#state;
    }

    get value() {
        return this.#value;
    }
}

export default MyPromise;
