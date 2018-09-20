const processPreferences = require('./process-preferences');
const Settings = require('./settings');
const SelectorProcessor = require('./selector');
const MessageManager = require('./message-manager');
const HotkeyBinder = require('./hotkey-binder');
const ModeSwitcher = require('./mode-switcher');
const InstantMode = require('./instant-mode');
const InputMode = require('./input-mode');
const Actions = require('./actions');
const RPCClient = require('./rpc-client');

async function init () {
    const app = {};
    const settings = app.settings = await Settings.load();
    const prefs = processPreferences(app);
    if (prefs.enabled) {
        app.messages = new MessageManager(app);
        app.actions = new Actions(app);
        app.selectorProcessor = new SelectorProcessor(app);
        app.modeSwitcher = new ModeSwitcher(app);
        app.modeSwitcher.add(InstantMode);
        app.modeSwitcher.add(InputMode);
        app.hotkeyBinder = new HotkeyBinder(app);
        app.hotkeyBinder.bind(settings, prefs);
        app.rpc = new RPCClient();

        if (prefs.mode) {
            await app.modeSwitcher.enter(prefs.mode);
            app.modeSwitcher.setValue(prefs.modeValue);
        }
    }
    return app;
}


(module || {}).exports = init();
