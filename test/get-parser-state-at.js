const assert = require('assert');
const getParserStateAt = require('../src/get-parser-state-at');

describe('get-parser-state-at', () => {
    it('should satisfy assertions', () => {
        const tests = [
            ["a 'b c'", 3, { string: true, escape: false }],
            ["a 'b c'", 2, { string: true, escape: false }],
            ["a 'b c'", 1, { string: false, escape: false }],
            ["a '\\' c'", 3, { string: true, escape: true }],
            ['a12b', 0, { string: false, escape: false }],
            ['a12b', 1, { string: false, escape: false }],
            ['a12b', 2, { string: false, escape: false }],
            ['a12b', 3, { string: false, escape: false }],
        ];

        tests.forEach(([input, at, expected]) => {
            assert.deepStrictEqual(getParserStateAt(input, at), expected, input);
        });
    });
});
