import MyEventEmitter from './MyEventEmitter.js';

import { jest } from '@jest/globals';


describe('MyEventEmitter', () => {
    let emitter;

    beforeEach(() => {
        emitter = new MyEventEmitter();
    });

    test('should register and emit an event', () => {
        const mockFn1 = jest.fn();
        const mockFn2 = jest.fn();

        emitter.on('testEvent', mockFn1);
        emitter.on('testEvent', mockFn2);
        emitter.on('testEvent', mockFn2);

        emitter.emit('testEvent');
        expect(mockFn1).toHaveBeenCalledTimes(1);
        expect(mockFn2).toHaveBeenCalledTimes(2);
    })

    test('should pass argument to the event all listeners', () => {
        const mockFn1 = jest.fn();
        const mockFn2 = jest.fn((number) => number + 10);

        emitter.on('testEvent', mockFn1);
        emitter.emit('testEvent', 'Hello', 'World');
        expect(mockFn1).toBeCalledWith('Hello', 'World');

        emitter.on('add10', mockFn2);
        emitter.emit('add10', 40);
        expect(mockFn2).toBeCalledWith(40);

        const returnedValue = mockFn2.mock.results[0].value;
        expect(returnedValue).toBe(50);
    })

    test(`should invoke an 'once' listner only once`, () => {
        const mockFn = jest.fn();

        emitter.once('testEvent', mockFn);
        emitter.once('testEvent', mockFn);

        emitter.emit('testEvent');
        emitter.emit('testEvent');

        expect(mockFn).toHaveBeenCalledTimes(1);
    })

    test(`should remove a listener with 'off'`, () => {
        const mockFn = jest.fn();

        emitter.on('testEvent', mockFn);
        emitter.emit('testEvent');
        expect(mockFn).toHaveBeenCalledTimes(1);

        emitter.off('testEvent', mockFn);
        emitter.emit('testEvent');
        expect(mockFn).toHaveBeenCalledTimes(1);
    })

    test(`should return all listeners when 'listeners' method is invoked`, () => {
        const mockFn1 = jest.fn();
        const mockFn2 = jest.fn();

        emitter.on('testEvent', mockFn1);
        emitter.on('testEvent', mockFn2);

        const listeners = emitter.listeners('testEvent');

        expect(listeners).toContain(mockFn1);
        expect(listeners).toContain(mockFn2);
        expect(listeners.length).toBe(2);
    })

    test(`should not throw error when emitting an event with no listeners`, () => {
        expect(() => {
            emitter.emit('noListenerEvent')
        }).not.toThrow();
    })

    test(`should not throw error when removing a non existing listener`, () => {
        expect(() => {
            emitter.off('noListenerEvent')
        }).not.toThrow();
    })


})


