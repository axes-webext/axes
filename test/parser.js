const assert = require('assert');
const inputParser = require('../src/input-parser.js');

describe('input-parser', () => {

    it('should parse selectors', () => {
        const selector = value => ({ patterns: null, type: 'selector', value });
        const tests = [
            ['{test}', selector('test')],
            ['test', false],
            ['{test}}', false],
            ['{.:()#>~*}', selector('.:()#>~*')],
            ['{a:not(a:visited)}', selector('a:not(a:visited)')],
            ['{a\\.class}', {
                "min": selector('a'),
                "sub": selector('.class'),
                "type": "exclude"
            }],
            ['{}', false],
            ['{.class|0,3-5\\#foo|1,2,3}',
             {
                 "min": {
                     "patterns": [
                         {
                             "type": "number",
                             "value": 0
                         },
                         {
                             "from": 3,
                             "to": 5,
                             "type": "interval",
                         }
                     ],
                     "type": "selector",
                     "value": ".class",
                 },
                 "sub": {
                     "patterns": [
                         {
                             "type": "number",
                             "value": 1
                         },
                         {
                             "type": "number",
                             "value": 2
                         },
                         {
                             "type": "number",
                             "value": 3
                         }
                     ],
                     "type": "selector",
                     "value": "#foo",
                 },
                 "type": "exclude"
             }
            ],
        ];

        tests.forEach(([input, expected]) => {
            if (expected === false) {
                assert.throws(() => inputParser.parse(input, { startRule: 'selectors1' }), 'input = ' + input);
            } else {
                let result = inputParser.parse(input, { startRule: 'target' });
                assert.deepStrictEqual(result, { type: 'selectors', value: expected }, 'assertion: ' + input + ' ?= ' + expected);
            }
        });
    });

    it('should parse modifiers', () => {
        Array.from('\'{}[]abc1234567890').forEach(mod => {
            assert.throws(() =>
                          inputParser.parse(mod, { startRule: 'modifier' }), 'parsed ' + mod + ' as modifier');
        });

        Array.from('!@#$%^&*_+-=~";:\|/?.><,').forEach(mod => {
            inputParser.parse(mod, { startRule: 'modifier' });
        });

    });

    it('should parse commands', () => {
        const bs = '\\', quot = "'";

        const tests = [
            [
                "!",
                [ { modifier: '!', args: [ ] } ]
            ],

            [
                "!'a''b'",
                [ { modifier: '!', args: [ 'a', 'b' ] } ]
            ],

            [
                "!'a b'",
                [ { modifier: '!', args: [ 'a b' ] } ]
            ],

            [
                "!'a " + bs + quot + " b'",
                [ { modifier: '!', args: [ 'a ' + quot + ' b' ] } ]
            ],

            [
                "!'a" + bs + bs + "b'",
                [ { modifier: '!', args: [ 'a' + bs + 'b' ] } ]
            ],
        ];

        tests.forEach(([input, expected]) => {
            let result = inputParser.parse(input, { startRule: 'commands' });
            assert.deepStrictEqual(result, expected);
        });
    });

    it('should parse labels', () => {
        const tests = [
            ['asd', 'asd'],
            ['12', '12'],
            ['', false],
        ];

        tests.forEach(([input, expected]) => {
            try {
                let result = inputParser.parse(input, { startRule: 'label' });
                assert.deepStrictEqual(result, expected);
            } catch(e) {
                if (expected !== false) {
                    assert(false, input + ' should not parse as label');
                }
            }
        });
    });

    it('should parse actions', () => {
        const defaultCommands = [{ modifier: '', args: []}];
        const tests = [
            ['', []],
            ["a!`d`'c''b'",
             [{ commands: [{ modifier: '!', args: []},
                           { modifier: 'd', args: ['c', 'b']}],
                target: { type:'label', value:'a' } }]],
            ['?', [{ commands: [{ modifier: '?', args: [] }],
                     target: { type: 'none' }}]],
            ['a', [{ commands: defaultCommands,
                     target: { type: 'label', value: 'a' }}]],

            ['a!', [{ commands: [{ modifier: '!', args: []}],
                      target: { type: 'label', value: 'a' }}]],

            ['!1', [{ commands: [{ modifier: '!', args: []}],
                      target: { type: 'label', value: '1' }}]],
            ['_[a-b\\c]', [ {
                "commands": [
                    {
                        "args": [],
                        "modifier": "_"
                    },
                ],
                "target": {
                    "type": "intervals",
                    "value": [
                        {
                            "min": {
                                "from": "a",
                                "to": "b",
                                "type": "interval"
                            },
                            "sub": "c",
                            "type": "exclude"
                        }
                    ]
                }
            } ]],
        ];

        tests.forEach(([input, expected]) => {
            let result = inputParser.parse(input, { startRule: 'start' });
            assert.deepStrictEqual(result, expected, input);
        });
    });

    describe('should parse intervals', () => {
        const interval = (a, b) => ({ from: a, to: b, type: 'interval' });
        const tests = [

            ['a-z',
             [
                 interval('a', 'z')
             ]
            ],

            ['a-z\\b-d',
             [
                 {
                     min: interval('a', 'z'),
                     sub: interval('b', 'd'),
                     type: 'exclude'
                 }
             ]
            ],

            ['a-z\\b-d\\g-i',
             [
                 {
                     min: {
                         type: 'exclude',
                         min: interval('a', 'z'),
                         sub: interval('b', 'd')
                     },
                     sub: interval('g', 'i'),
                     type: 'exclude'
                 }
             ]
            ],

            ['a-z\\b-d\\g-i\\k-m',
             [
                 {
                     "min": {
                         "min": {
                             "min": interval('a', 'z'),
                             "sub": interval('b', 'd'),
                             "type": "exclude",
                         },
                         "sub": interval('g', 'i'),
                         "type": "exclude",
                     },
                     "sub": interval('k', 'm'),
                     "type": "exclude",
                 }
             ]
            ],

            ['a-d\\+--',
             [
                 {
                     min: interval('a', 'd'),
                     sub: {
                         pattern: [true, false, false],
                         type: 'pattern'
                     },
                     type: 'exclude',
                 }
             ]
            ],

            ['a-z\\+2-4',
             [
                 {
                     min: interval('a', 'z'),
                     sub: {
                         pattern: [true, true, false, false, false, false],
                         type: 'pattern'
                     },
                     type: 'exclude',
                 }
             ]
            ],

            ['1-4\\2-3\\+-',
             [
                 {
                     min: {
                         type: 'exclude',
                         min: interval('1', '4'),
                         sub: interval('2', '3')
                     },
                     sub: {
                         type: 'pattern',
                         pattern: [true, false]
                     },
                     type: 'exclude',
                 }
             ]
            ],

            ['a-z\\b-d\\g-i\\+-',
             [
                 {
                     type: 'exclude',
                     min: {
                         min: {
                             type: 'exclude',
                             min: interval('a', 'z'),
                             sub: interval('b', 'd')
                         },
                         sub: interval('g', 'i'),
                         type: 'exclude'
                     },
                     sub: {
                         type: 'pattern',
                         pattern: [true, false],
                     }
                 }
             ]
            ],
        ];

        tests.forEach(([input, expected]) => {
            it(input, () => {
                let result = inputParser.parse(input, { startRule: 'intervals' });
                assert.deepStrictEqual(expected, result, input);
            });
        });
    });
});
