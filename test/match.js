const assert = require('assert');
const match = require('../src/match.js');

describe('match', () => {
    it('should satisfy assertions', () => {
        tests = [
            ['abc', { type: 'contain', value: 'a' }, true],
            ['abc', { type: 'contain', value: 'd' }, false],
            ['abc', { type: 'start', value: 'c' }, false],
            ['abc', { type: 'start', value: 'ab' }, true],
            ['abc', { type: 'match', value: 'abc' }, true],
            ['abc', { type: 'match', value: '' }, false],
            ['abC', { type: 'match-regexp', value: '/^abc$/i' }, true],
            ['abC', { type: 'match-regexp', value: '/^abc$/' }, false],
            ['https://www.google.com/search', { type: 'match-domain', value: 'www.google.com' }, true],
            ['https://www.google.com/search', { type: 'match-domain', value: 'google.com' }, false],
        ];

        tests.forEach(([input, pattern, expected]) => {
            assert.equal(match(input, pattern), expected,
                         `match(${input}, {type: ${pattern.type}, value: ${pattern.value}}) == ${expected}`);

        });
    });
});
