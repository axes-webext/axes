const fs = require('fs');
const data = require('../src/default-settings');
const assert=require('assert');
const Ajv = require('ajv');

describe('settings-schema.json', () => {
    let validate = null;
    it('compiles', () => {
        const ajv = new Ajv({ allErrors: true });
        validate = ajv.compile(JSON.parse(fs.readFileSync('./src/settings-schema.json')));
    });

    it('is valid for default-settings', () => {
        validate(data);
        if (validate.errors) {
            console.log(require('util').inspect(validate.errors, false, 5));
        }
        assert.deepEqual(validate.errors, null);
    });
});
