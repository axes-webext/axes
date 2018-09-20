const Scenario = require('../src/scenario');
const defaultSettings = require('../src/default-settings');

const assert = require('assert');

describe('scenario.validate', () => {
    it('should report missing labels', () => {
        const app = {
            settings: {
                modifiers: {
                },
            },
        };
        const labelManager = {
            labelList: ['b'],
            labels: {
                'b': {}
            },
        };
        const parsedInput = [
            {
                commands: [],
                target: { type: 'label', value: 'b' },
            },
            {
                commands: [],
                target: { type: 'label', value: 'a' },
            }
        ];

        const scenario = new Scenario(app).from(parsedInput);
        const report = scenario.validateBefore(labelManager).messages;
        assert.deepStrictEqual(report, [ { type: 'error', text: 'No such label: a' } ]);
    });

    it('should report missing modifiers', () => {
        const app = {
            settings: {
                modifiers: {
                    'a': [],
                },
            },
        };
        const labelManager = {
            labelList: ['b'],
            labels: {
                'b': {}
            },
        };
        const parsedInput = [
            {
                commands: [ { modifier: 'a', args: [] },
                            { modifier: 'b', args: [] }],
                target: { type: 'label', value: 'b' },
            },
        ];

        const scenario = new Scenario(app).from(parsedInput);
        const report = scenario.validateBefore(labelManager).messages;
        assert.deepStrictEqual(report, [ { type: 'error', text: 'No such modifier: b' } ]);
    });

});
