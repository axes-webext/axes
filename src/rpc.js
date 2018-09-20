class RPCServer {
    constructor (runtime) {
        if (!(runtime instanceof Runtime)) {
            throw "runtime must be instance of Runtime";
        }
        this.runtime = runtime;
    }

    execute (call) {
        const promise = new Promise(async (resolve, reject) => {
            try {
                if (call.statements instanceof Array) {
                    for (let statement of call.statements) {
                        this.execute(statement);
                    }
                } else if (call.arguments instanceof Array && typeof call.call == 'string') {
                    let props = call.call.split('.');
                    if (props.length == 0) {
                        reject("no such object in env");
                    }
                    const that = this.runtime.getProps(props.slice(0, props.length - 1));
                    const obj = this.runtime.getProps(props);
                    resolve(await obj.apply(that, call.arguments));
                } else {
                    reject('Incorrect format');
                }
            } catch (e) {
                console.log('RPC error:', e);
                reject(e);
            }
        });

        return promise;
    }
}

class Runtime {
    constructor (env = {}) {
        this.env = env;
    }

    getProps(props) {
        let obj = this.env;
        for (let i = 0; i < props.length; i++) {
            obj = obj[props[i]];
        }
        return obj;
    }
}


module.exports = {
    RPCServer: RPCServer,
    Runtime: Runtime,
};
