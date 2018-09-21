const assert = require('assert');
const inputParser = require('../src/input-parser.js');
const checkLabels = require('../src/check-labels');
const doesNotFollow = (from, to) => {
    return {
        "text": `Label ${to} does not follow up label ${from}`,
        "type": "error"
    };
};

describe('checkLabels', () => {
    it('should satisfy assertions', () => {
        // No 'y' in alphabet!
        const labels = Array.from('abcdefghijklmnopqrstuvwxz');
        const tests = [
            ['z-a', false],
            ['a-z', true],
            ['a-y', false],
            ['y-z', false],
            ['y-z\\c', false],
            ['asd', false],
            ['a', true],
        ];
        tests.forEach(([input, correct]) => {
            let parsedInput = inputParser.parse(input, { startRule: 'intervals' });
            let result = checkLabels(parsedInput, labels);
            assert.equal(result.length == 0, correct, 'Test: ' + input);
        });
    });

    it('should satisfy assertions', () => {
        // No 'y' in alphabet!
        const labels = Array.from('abcdefghijklmnopqrstuvwxyz');
        const tests = [
            ['z-a', [doesNotFollow('z','a')]],
            ['a-c', []],
        ];
        tests.forEach(([input, expected]) => {
            let parsedInput = inputParser.parse(input, { startRule: 'intervals' });
            let result = checkLabels(parsedInput, labels);
            assert.deepStrictEqual(result, expected, 'Test: ' + input);
        });
    });
});
