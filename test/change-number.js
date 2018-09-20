const assert = require('assert');
const changeNumber = require('../src/change-number');

const inc = x => x + 1;

describe('changeNumber', () => {
    const tests = [
        ['abc123de', 0, inc, 'abc123de'],
        ['abc123de', 1, inc, 'abc123de'],
        ['abc123de', 2, inc, 'abc123de'],
        ['abc123de', 3, inc, 'abc124de'],
        ['abc123de', 4, inc, 'abc124de'],
        ['abc123de', 5, inc, 'abc124de'],
        ['abc123de', 6, inc, 'abc124de'],
        ['abc123de', 7, inc, 'abc123de'],
    ];

    tests.forEach(([input, at, f, expected]) => {
        it(`${input} @ ${at}`, () => {
            assert.deepStrictEqual(changeNumber(f, input, at), expected, input);
        });
    });
});
