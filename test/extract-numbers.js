const assert = require('assert');
const extractNumbers = require('../src/extract-numbers');
const expect = (index, length, value) => ({ index, length, value });

describe('extractNumbers', () => {
    const tests = [
        ['a1b12cde23', [expect(1,1,1),
                        expect(3,2,12),
                        expect(8,2,23)]],
        ['abcdefgh', []],
        ['1', [expect(0, 1, 1)]],
    ];

    tests.forEach(([input, expected]) => {
        it(input, () => {
            assert.deepStrictEqual(extractNumbers(input), expected, input);
        });
    });
});
