const { RPCServer, Runtime } = require('../src/rpc.js');

const assert = require('assert');

describe('rpc', () => {
    it('should pass tests', async () => {
        let b = false;
        const runtime = new Runtime({ foo: { bar: { baz: (c) => b = c } } });
        const server = new RPCServer(runtime);
        await server.execute({ call: 'foo.bar.baz', arguments: [true] });
        assert.equal(b, true, 'state has changed');

    });
});
