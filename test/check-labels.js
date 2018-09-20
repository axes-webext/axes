const assert = require('assert');
const inputParser = require('../src/input-parser.js');
const checkLabels = require('../src/check-labels');

describe('checkLabels', () => {
    it('should satisfy assertions', () => {
        // No 'y' in alphabet!
        const labels = Array.from('abcdefghijklmnopqrstuvwxz');
        const tests = [
            ['z-a', false],
            ['a-z', true],
            ['a-y', false],
            ['y-z', false],
            ['asd', false],
            ['a', true],
        ];
        tests.forEach(([input, correct]) => {
            let parsedInput = inputParser.parse(input, { startRule: 'intervals' });
            let result = checkLabels(parsedInput, labels);
            assert.equal(result.length == 0, correct, 'Test: ' + input);
        });
    });
});
