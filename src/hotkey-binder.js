const Settings = require('./settings');
const translateBinding = require('./translate-bindings');

/** Binds hotkeys according to the settings. Uses Mousetrap.js */
module.exports = class HotkeyBinder {
    constructor (app) {
        this.bound = [];
        this.app = app;
    }

    bind (settings, prefs) {
        const enter = (mode, value) => async () => {
            await this.app.modeSwitcher.enter(mode);
            this.app.modeSwitcher.currentMode.input.value = value || '';
        };

        settings.hotkeys.forEach(({ binding, action, value, global, preventDefault }) => {
            if (prefs.disabledHotkeys.includes(binding)) { return; }

            let func = () => {};
            const bindFunction = (hotkey, handler) => {
                Mousetrap[global ? 'bindGlobal' : 'bind'](hotkey, handler);
            };

            switch (action) {
                case 'start-input':
                    func = enter('input', value);
                    break;

                case 'start-instant':
                    func = enter('instant', value);
                    break;

                case 'clear-messages':
                    func = () => { this.app.messages.clear(); };
                    break;

                case 'leave-focus':
                    func = () => { document.activeElement.blur(); };
                    break;

                case 'turn-off':
                    func = () => {
                        this.app.messages.add('Turned off until page reload');
                        this.unbindAll();
                    };
                    break;

                case 'turn-off-page':
                    func = async () => {
                        const rule = {
                            pattern: { type: 'match',
                                       value: document.location.href },
                            action: 'turn-off',
                            value: '' };
                        const settings = await Settings.load();
                        settings.startup_preferences.push(rule);
                        await Settings.save(settings);
                        this.app.messages.add('Permanently turned off on this page');
                        this.unbindAll();
                    };
                    break;

                case 'turn-off-domain':
                    func = async () => {
                        const rule = {
                            pattern: { type: 'match-domain',
                                       value: document.location.host },
                            action: 'turn-off',
                            value: '' };
                        const settings = await Settings.load();
                        settings.startup_preferences.push(rule);
                        await Settings.save(settings);
                        this.app.messages.add('Permanently turned off on this domain');
                        this.unbindAll();
                    };
                    break;

                case 'show-help':
                    func = () => {
                        this.app.actions.show_help.toggleMessage(this.app);
                    };
                    break;
            }


            translateBinding(binding, this.app.settings.keymap).forEach(binding => {
                this.bound.push(binding);

                bindFunction(binding, preventDefault ? (evt => {
                    evt.preventDefault();
                    func(evt);
                }) : func);
            });
        });
    }

    unbindAll () {
        this.bound.forEach(hotkey => {
            Mousetrap.unbind(hotkey);
        });
        this.bound = [];
    }
};
