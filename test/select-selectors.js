const proxyquire =  require('proxyquire');
const assert = require('assert');

const inputParser = require('../src/input-parser.js');
const selectSelectors = proxyquire('../src/select-selectors.js', {
    './safe-qs': selector => {
        return new Array(20).fill(0)
            .map((_, i) => selector + i);
    }});

const plus = s => x => s + x;

describe('selectSelectors', () => {
    const tests = [
        ['{s|1,3-5}', [1,3,4,5].map(x => 's' + x)],
        ['{s|1,4-8\\s|6}', [1,4,5,7,8].map(plus('s'))],
        ['{s\\s|1-18}', [0,19].map(plus('s'))],
        // left associativity:
        ['{s|0-5\\s|1-4\\s|3}',
         [0,5].map(plus('s'))],
        ['{(((s|0-5)\\s|1-4)\\s|3)}',
         [0,5].map(plus('s'))],

        ['{(s|0)}', [0].map(plus('s'))],
        ['{(s|0-5\\s|1-4)}', [0,5].map(plus('s'))],
        ['{(s|0-5\\s|1-4)\\s|3}', [0,5].map(plus('s'))],
        ['{s|0-5\\(s|1-4\\(s|3))}', [0,3,5].map(plus('s'))],
    ];
    tests.forEach(([input, expected]) => {
        it(input, () => {
            const selectors = inputParser.parse(input, { startRule: 'target' }).value;
            assert.deepStrictEqual(selectSelectors(selectors), expected);
        });
    });
});
