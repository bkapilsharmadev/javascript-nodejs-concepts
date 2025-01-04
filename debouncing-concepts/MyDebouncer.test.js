import MyDebouncer from "./MyDebouncer.js";

import { jest } from '@jest/globals';


jest.useFakeTimers();


describe('MyDebouncer', () => {
    let debouncer, mockCallback;

    beforeEach(() => {
        debouncer = new MyDebouncer();
        mockCallback = jest.fn();
    })

    test('should create a debounced function that calls the callback after delay', () => {
        const debouncedFn = debouncer.debounce(mockCallback, 500);

        debouncedFn('Test call');
        jest.advanceTimersByTime(499);
        expect(mockCallback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith('Test call');
    })

    test('should cancel the previous timer when the debounced function is called again', () => {
        const debouncedFn = debouncer.debounce(mockCallback, 500);

        debouncedFn('First Call');
        jest.advanceTimersByTime(300);
        debouncedFn('Second Call');
        
        jest.advanceTimersByTime(300);
        expect(mockCallback).not.toHaveBeenCalled();

        jest.advanceTimersByTime(200);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith('Second Call');

    })
})













