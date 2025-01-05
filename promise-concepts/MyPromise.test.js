import MyPromise from "./MyPromise.js";

import { jest } from '@jest/globals';
// jest.useFakeTimers();

describe('MyPromise', () => {
    test('should transition to fulfilled state with a value', () => {
        const myPromise = new MyPromise((resolve) => {
            resolve('RESOLVED VALUE');
        });

        expect(myPromise.state).toBe('fulfilled');
        expect(myPromise.value).toBe('RESOLVED VALUE');
    })

    test('should transition to rejected with a reason', () => {
        const myPromise = new MyPromise((_, reject) => {
            reject('REJECTION REASON');
        })

        expect(myPromise.state).toBe('rejected');
        expect(myPromise.value).toBe('REJECTION REASON');
    })

    test('multiple resolve or reject should execute only once', () => {
        const myPromise1 = new MyPromise((resolve, reject) => {
            resolve('RESOLVED 1');
            resolve('RESOLVED 2');
            reject('reject 1');
            reject('reject 2');
        })

        expect(myPromise1.state).toBe('fulfilled');
        expect(myPromise1.value).toBe('RESOLVED 1');

        const myPromise2 = new MyPromise((resolve, reject) => {
            reject('REJECT 1');
            resolve('RESOLVED 1');
            resolve('RESOLVED 2');
            reject('reject 2');
        })

        expect(myPromise2.state).toBe('rejected');
        expect(myPromise2.value).toBe('REJECT 1');
    })

    test('the .then fn should invoke onFulfilled when the promise is fulfilled', (done) => {
        const myPromise = new MyPromise(resolve => {
            resolve('RESOLVED VALUE');
        })

        myPromise.then(value => {
            expect(value).toBe('RESOLVED VALUE');
            done();
        })
    })

    test('should call onRejected when the promise is rejected', (done) => {
        const myPromise = new MyPromise((_, reject) => {
            reject('REJECETD REASON');
        })

        myPromise.then(null, reason => {
            expect(reason).toBe('REJECETD REASON');
            done();
        })
    })

    test('should store onFulfilled and onRejected if the promise is pending', (done) => {
        const myPromise = new MyPromise((resolve) => {
            setTimeout(() => resolve('RESOLVED VALUE'), 500);
        });

        myPromise.then((value) => {
            expect(value).toBe('RESOLVED VALUE');
            done();
        });
    });

    test('should allow chaining of then fn', (done) => {
        const myPromise = new MyPromise(resolve => {
            resolve(10);
        })

        myPromise
            .then(value => value * 2)
            .then(value => value + 10)
            .then(value => {
                expect(value).toBe(30)
                done();
            })
    })

    test('should adopt the state of a promise returned from onFulfilled', (done) => {
        const myPromise = new MyPromise((resolve) => {
            resolve(10);
        });

        myPromise
            .then((value) => {
                return new MyPromise((resolve) => {
                    setTimeout(() => resolve(value * 2), 500);
                });
            })
            .then((value) => {
                expect(value).toBe(20);
                done();
            });
    });


    test('should call onRejected when the promise is rejected', (done) => {
        const myPromise = new MyPromise((_, reject) => {
            reject('Error occurred');
        });

        myPromise.catch((reason) => {
            expect(reason).toBe('Error occurred'); // Verify the rejection reason
            done();
        });
    });


    test('should not call onRejected if the promise is fulfilled', (done) => {
        const myPromise = new MyPromise((resolve) => {
            resolve('Success');
        });

        myPromise.catch(() => {
            throw new Error('This should not be called'); // Should not reach here
        });

        myPromise.then((value) => {
            expect(value).toBe('Success'); // Verify fulfillment
            done();
        });
    });


    test('should allow chaining after handling a rejection', (done) => {
        const myPromise = new MyPromise((_, reject) => {
            reject('Initial error');
        });

        myPromise
            .catch((err) => {
                expect(err).toBe('Initial error');
                return 'Recovered'; // Recover from the error
            })
            .then((value) => {
                expect(value).toBe('Recovered'); // Verify recovery
                done();
            });
    });


    test('should execute finally after promise is fulfilled', (done) => {
        const myPromise = new MyPromise((resolve) => {
            resolve('Fulfilled');
        });

        let finallyCalled = false;

        myPromise
            .finally(() => {
                finallyCalled = true;
            })
            .then((value) => {
                expect(value).toBe('Fulfilled');
                expect(finallyCalled).toBe(true); // Ensure finally was called
                done();
            });
    });


    test('should execute finally after promise is rejected', (done) => {
        const myPromise = new MyPromise((_, reject) => {
            reject('Rejected');
        });

        let finallyCalled = false;

        myPromise
            .finally(() => {
                finallyCalled = true;
            })
            .catch((reason) => {
                expect(reason).toBe('Rejected');
                expect(finallyCalled).toBe(true); // Ensure finally was called
                done();
            });
    });


    test('should not change the resolved value in finally', (done) => {
        const myPromise = new MyPromise((resolve) => {
            resolve('Original Value');
        });

        myPromise
            .finally(() => {
                return 'Ignored Value'; // This is ignored
            })
            .then((value) => {
                expect(value).toBe('Original Value'); // Ensure the original value is preserved
                done();
            });
    });


    test('should reject if an error is thrown in finally', (done) => {
        const myPromise = new MyPromise((resolve) => {
            resolve('Success');
        });

        myPromise
            .finally(() => {
                throw new Error('Error in finally');
            })
            .catch((err) => {
                expect(err.message).toBe('Error in finally'); // Ensure error is propagated
                done();
            });
    });




})

