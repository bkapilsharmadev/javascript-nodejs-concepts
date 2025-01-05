import { beforeEach } from 'jest-circus';
import MyEventEmitter from './MyEventEmitter.js';

describe('MyEventEmitter', () => {
    let emitter = null;

    beforeEach(() => {
        emitter = new MyEventEmitter();
    })

    test('should register and emit an event', () => {
        const mockFn = jest.fn();
        emitter.on('testEvent', mockFn);
        emitter.emit('testEvent');
        expect(mockFn).toHaveBeenCalledTimes(1);
    })
})