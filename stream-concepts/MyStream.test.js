import MyStream from './MyStream.js';

import { jest } from '@jest/globals';

describe('MyStream', () => {
    let myStream = null;
    let mockFn = null;

    beforeEach(() => {
        myStream = new MyStream();
        mockFn = jest.fn();
    })

    test(`should emit data chunks added to the STREAM`, () => {
        myStream.on('data', mockFn);
        myStream.push('chunk1');
        myStream.push('chunk2');

        expect(mockFn).toHaveBeenCalledWith('chunk1')
        expect(mockFn).toHaveBeenCalledWith('chunk2')
        expect(mockFn).toHaveBeenCalledTimes(2);
    })

    test(`emit 'end' event when null is pushed`, () => {
        myStream.on('end', mockFn);

        myStream.push('chunk1');
        myStream.push(null);

        expect(mockFn).toHaveBeenCalledTimes(1);
    })

    test(`should not emit 'data' after the 'end' is emitted`, () => {
        const mockDataFn = jest.fn();
        const mockEndFn = jest.fn();

        myStream.on('data', mockFn);

        myStream.push('chunk1');
        myStream.push('chunk2');
        myStream.on('data', mockDataFn); // Listen for "data" events
        myStream.push('chunk3');
        myStream.push(null);
        

        expect(() => myStream.push('chunk4')).toThrow()

        expect(mockFn).toHaveBeenCalledWith('chunk1');
        expect(mockFn).toHaveBeenCalledWith('chunk2');
        expect(mockFn).toHaveBeenCalledWith('chunk3');
        expect(mockFn).toHaveBeenCalledTimes(3);
        expect(mockFn).not.toHaveBeenCalledWith('chunk4');


        myStream.on('end', mockEndFn); // Listen for the "end" event

        // Assertions for mockFn
        expect(mockFn).toHaveBeenCalledWith('chunk1');
        expect(mockFn).toHaveBeenCalledWith('chunk2');
        expect(mockFn).toHaveBeenCalledWith('chunk3');
        expect(mockFn).not.toHaveBeenCalledWith('chunk4');
        expect(mockFn).toHaveBeenCalledTimes(3);

        // Assertions for mockDataFn (late listener)
        expect(mockDataFn).toHaveBeenCalledWith('chunk3'); // Received only "chunk3"
        expect(mockDataFn).not.toHaveBeenCalledWith('chunk1'); // Late listeners don't receive past events
        expect(mockDataFn).not.toHaveBeenCalledWith('chunk2');
        expect(mockDataFn).not.toHaveBeenCalledWith('chunk4');
        expect(mockDataFn).toHaveBeenCalledTimes(1);

        // Assertions for mockEndFn
        expect(mockEndFn).toHaveBeenCalledTimes(0); // "end" should be triggered
    })

    test(`should 'pause' and 'resume' the stream`, () => {
        myStream.on('data', mockFn);

        myStream.push('chunk1');
        expect(mockFn).toHaveBeenCalledWith('chunk1');
        myStream.pause();
        myStream.push('chunk2');
        expect(mockFn).not.toHaveBeenCalledWith('chunk2');
        myStream.push('chunk3');
        expect(mockFn).not.toHaveBeenCalledWith('chunk3');
        myStream.resume();

        expect(mockFn).toHaveBeenCalledTimes(3);
    })

})