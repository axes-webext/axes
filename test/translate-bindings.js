const assert = require('assert');
const util = require('util');
const translateBindings = require('../src/translate-bindings');
const defs = require('../settings/js/defs');

describe('translateBindings.tokenize', () => {
    it('should satisfy assertions', () => {
        const tests = [
            ['shift+a', ['shift', '+', 'a']],
            ['shift+a ctrl+c', ['shift', '+', 'a', ' ', 'ctrl', '+', 'c']],
            ['shift+a f10', ['shift', '+', 'a', ' ', 'f10']],
        ];
        tests.forEach(([input, expected]) => {
            assert.deepStrictEqual(translateBindings.tokenize(input), expected, input);
        });
    });
});


describe('translateBindings.translate', () => {
    it('should satisfy assertions', () => {
        const tests = [
            ['shift+s', {}, [['shift','+', 's']]],
            ['shift+s', {'s': ['ы', 'ф']}, [
                ['shift', '+', 's'],
                ['shift', '+', 'ы'],
                ['shift', '+', 'ф'],
            ]],
            ['shift+s ctrl+d', {'s': ['ы', 'ф'],
                                'd': ['ю', 'ф']},
             [ [ 'shift', '+', 's', ' ', 'ctrl', '+', 'd' ],
               [ 'shift', '+', 's', ' ', 'ctrl', '+', 'ю' ],
               [ 'shift', '+', 's', ' ', 'ctrl', '+', 'ф' ],
               [ 'shift', '+', 'ы', ' ', 'ctrl', '+', 'd' ],
               [ 'shift', '+', 'ы', ' ', 'ctrl', '+', 'ю' ],
               [ 'shift', '+', 'ы', ' ', 'ctrl', '+', 'ф' ],
               [ 'shift', '+', 'ф', ' ', 'ctrl', '+', 'd' ],
               [ 'shift', '+', 'ф', ' ', 'ctrl', '+', 'ю' ],
               [ 'shift', '+', 'ф', ' ', 'ctrl', '+', 'ф' ] ]
            ],
        ];
        tests.forEach(([input, rmap, expected]) => {
            const tokens = translateBindings.tokenize(input);
            const result = translateBindings.translate(tokens, rmap);
            assert.deepStrictEqual(result, expected, input);
        });
    });
});

describe('translateBindings', () => {
    it('should satisfy assertions', () => {
        const tests = [
            ['shift+s', defs.keymaps['russian-computer'].keymap,
             ['shift+s', 'shift+ы'],
            ],
        ];

        tests.forEach(([input, keymap, expected]) => {
            const result = translateBindings(input, keymap);
            assert.deepStrictEqual(result, expected, input);
        });
    });
});
