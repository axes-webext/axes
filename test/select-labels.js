const assert = require('assert');
const inputParser = require('../src/input-parser.js');
const selectLabels = require('../src/select-labels.js');

function parse (input, labels) {
    let result = inputParser.parse(input, { startRule: 'intervals' });
    let t = selectLabels(result, labels);
    return t;
}

const chrs = s => [].map.call(s, x => x);

describe('select-labels', () => {
    const labels = Array.from("abcdefghijklmnopqrstuvwxyz");
    describe('should satisfy assertions', () => {
        const tests = [
            ["a-c", "a,b,c"],
            ["a-a", "a"],
            ["a-c", ["a", "b", "c"]],
            ["a-c\\b", ["a", "c"]],
            ["a-e\\\\1\\c", ["a", "e"]],
            ["a-c\\b-b", ["a", "c"]],
            ["a-z\\\\5", chrs("agmsy")],
            ["a-d\\\\0", chrs("abcd")],
            ["b-a", []],

            ["a-i\\b-h\\c-g\\d-f", ["a","i"]],
            ["a-i\\b-h\\c-g", ["a","i"]],
            ["((a-i\\b-h)\\c-g)\\d-f", ["a","i"]],

            ["a-i\\(b-h\\(c-g\\d-f))", ["a", "c", "g", "i"]],
            ['a-g\\+-', ['a', 'c', 'e', 'g']],
            ['a-d\\+', ['a', 'b', 'c', 'd']],
            ['a-d\\-', []],
        ];

        tests.forEach(([input, expected]) => {
            it(input, () => {
                let result = parse(input, labels);
                if (expected instanceof Array) {
                    assert.deepStrictEqual(result, expected);
                } else if (typeof expected === 'string') {
                    assert.deepStrictEqual(parse(expected, labels), result);
                }
            });
        });
    });
});
