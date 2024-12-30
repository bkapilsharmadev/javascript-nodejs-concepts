const MyPromise =  require('./MyPromise.js');


describe('MyPromise: Resolve and Reject', () => {
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
    
})

