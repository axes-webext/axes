module.exports = class RPCClient {
    constructor () {
        this.counter = 0;
        this.port = browser.runtime.connect({ name: 'rpc' });
        this.pending = {};
        this.port.onMessage.addListener((response) =>  {
            const id = response.id;
            if (id in this.pending) {
                if ('result' in response) {
                    this.pending[id].resolve(response.result);
                } else {
                    this.pending[id].reject(response.error);
                }
            }
        });
    }

    execute (message) {
        const id = this.counter;
        this.counter++;
        this.port.postMessage({ id, message });
        const promise = new Promise((resolve, reject) => {
            this.pending[id] = { resolve, reject }
        });
        return promise;
    }
}
