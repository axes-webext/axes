const { Runtime, RPCServer } = require('./rpc');
const defaults = require('./default-settings');
const settings = require('./settings');

/* Set settings to defaults on startup */
browser.storage.local.get({ settings: null }).then(x => {
    if (!x.settings) {
        browser.storage.local.set({ settings: defaults });
    }
});

/* Create a RPC runtime */
const runtime = new Runtime({
    browser: browser,
    imageToClipboard: (src) => fetch(src)
        .then(response => response.arrayBuffer())
        .then(b => browser.clipboard.setImageData(b, 'png')
                          .catch(_ => browser.clipboard.setImageData(b, 'jpeg')))
});

/* Create a RPC server */
const server = new RPCServer(runtime);

/* Bind RPC handlers */
browser.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(async ({ id, message }) => {
        console.log('message', id, message);
        server.execute(message).then(result => {
            console.log('success', id, result);
            port.postMessage({ id, result });
        }).catch(error => {
            console.log('error', { id, error });
            port.postMessage({ id, error });
        });
    });
});

/* Open settings page by click on icon */
browser.browserAction.onClicked.addListener(() => {
    browser.runtime.openOptionsPage();
});
