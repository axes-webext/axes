const assert = require('assert');
const LabelManager = require('../src/label-manager');

describe('label-manager', () => {
    it('getLabel()', () => {
        const tests = [
            ['abc', 10, false,
             [ 'a', 'b', 'c', 'aa', 'ab', 'ac', 'ba', 'bb', 'bc', 'ca' ]],

            ['a', 4, false,
             [ 'a', 'aa', 'aaa', 'aaaa' ]],
            ['abc', 4, true,
             [ 'aa', 'ab', 'ac', 'ba' ]],
            ['ab', 5, true,
             [ 'aaa', 'aab', 'aba', 'abb', 'baa' ]],
        ];

        tests.forEach(([alphabet, n, sameLengthLabels, expected]) => {
            const app = {settings: {labels: { alphabet: alphabet }}};
            const labelManager = new LabelManager(app, sameLengthLabels);
            const labels = labelManager.getLabels(new Array(n).fill(null));
            assert.deepEqual(labels, expected);
        });
    });
});
