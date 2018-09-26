const triggerEvent = require('./trigger-event');
const Action = require('./action');
const safeMatches = require('./safe-matches');
const T4ble = require('../settings/js/t4ble');
const getProperty = require('./get-property');

const doesNotAccept = (args, action, err = 'error') => {
    if (args.length > 0) {
        return [{
            type: err,
            text: `Action ${action.title} does not accept arguments`
        }];
    }
    return [];
};

const requiresTags = (elements, tagList, getMessage) => {
    let r = [];
    for (let el of elements) {
        if (!tagList.includes(el.tagName)) {
            r.push({ type: 'warning', text: getMessage(elements) });
            break;
        }
    }
    return r;
};

const addSuffix = (str, suffix) => {
    if (!str.endsWith(suffix)) {
        str += suffix;
    }
    return str;
};


const actions = {
    autodetect: class Autodetect extends Action {
        constructor () {
            super();
            this.title = 'Autodetection';
            this.color = 'pink';
            this.info = 'Autodetect action based on autodetection settings.';
        }

        validate ({ args })  {
            return doesNotAccept(args, this);
        }

        run ({ target, args, app }) {
            target.elements.forEach(elem => {
                let a = 'click';
                for (let { selector, action } of app.settings.autodetection) {
                    if (safeMatches(elem, selector)) {
                        a = action;
                        break;
                    }
                }
                app.actions[a].run({ target: { elements: [elem], type: 'autodetection' },
                                     args: [],
                                     app: app });
            });
        }
    },

    show_help: class ShowHelp extends Action {
        constructor () {
            super();
            this.title = 'Show help';
            this.color = 'black';
            this.info = 'Show help message';
        }

        showMessage (app) {
            if (app.messages.exists(this.messageId)) return;
            const message = this.addMessage(app, 'Help message');
            const style = { style: { 'font-size': '10px', display: 'table-cell' } };
            this.messageId = message.id;

            // Add table with modifiers
            new T4ble(Object.keys(app.settings.modifiers).map(modifier => [
                // Modifier character
                /[a-z0-9]+/g.test(modifier) ? '`' + modifier + '`' : modifier,
                // List of associated actions with arguments
                new T4ble(app.settings.modifiers[modifier]
                             .map(({ action, args }) => [
                                 (app.actions[action] || { title: '' }).title +
                                 (args.length ? ` (${args.join(', ')})` : '')
                             ]), style)
            ]), style).appendTo(message.element);

            new T4ble(app.settings.hotkeys.map(({ binding, action, value }) => [
                binding,
                action + (value ? `(${value})` : ''),
            ]), style).appendTo(message.element);
        }

        removeMessage (app) {
            app.messages.remove(this.messageId);
            delete this.messageId;
        }

        toggleMessage (app) {
            this[app.messages.exists(this.messageId) ?
                 'removeMessage' : 'showMessage'](app);
        }

        validate ({ app }) {
            this.showMessage(app);
        }

        onScenarioEnd (app) {
            this.removeMessage(app);
        }

        onAdd (app) {
            this.showMessage(app);
        }

        onRemove (app) {
            this.removeMessage(app);
        }
    },

    click: class Click extends Action {
        constructor () {
            super();
            this.title = 'Click';
            this.color = '#9F9';
            this.info = 'Click element using .click() method';
        }

        validate ({ args }) {
            return doesNotAccept(args, this);
        }

        run ({ target, args: args, app: app}) {
            target.elements.forEach(element =>
                                    // Some elements do not have .click() method, e.g. <svg>
                                    typeof element.click !== 'function' || element.click());
        }
    },

    open_in_new_tab: class OpenInNewTab extends Action {
        constructor () {
            super();
            this.title = 'Open in new tab';
            this.color = '#CCF';
            this.info = 'Open link or media in a new tab. Pass "inactive" as argument to open the tab without switching to it.';
            this.shouldAwait = true;
        }

        validate ({ args, target }) {
            for (const el of target.elements) {
                if ((el.href || '').startsWith('javascript:')) {
                    return [{ type: 'warning',
                              text: "'Open in new tab': couldn't open 'javascript:' URL" }];
                }
            }
        }

        async run ({ target, args, app }) {
            for (let element of target.elements) {
                let { value: url } = await getProperty(element, ['src', 'href']);
                if (url && !url.startsWith('javascript:')) {
                    await app.rpc.execute({ call: 'browser.tabs.create', arguments: [{
                        active: !args.includes('inactive'),
                        url
                    }]});
                } else {
                    app.messages.add('No valid URL to open');
                }
            }
        }
    },

    open_in_this_tab: class OpenInThisTab extends Action {
        constructor () {
            super();
            this.title = 'Open in this tab';
            this.color = '#9FF';
            this.info = 'Open link in this tab';
            // Because resetting document.location also terminates JS execution
            this.shouldAwait = true;
        }

        async run({ target, app }) {
            let source = null;

            for (let element of target.elements) {
                let { value: src } = await getProperty(element, ['src', 'href']);
                if (src) {
                    source = src;
                    break;
                }
            }

            if (source) {
                document.location.href = source;
            } else {
                app.messages.add({ type: 'info', text: 'No URL to open' });
            }
        }
    },

    remove: class Remove extends Action {
        constructor () {
            super();
            this.title = 'Remove element';
            this.color = '#F00';
            this.info = 'Remove element from DOM using .remove() method';
        }

        run({ target }) {
            target.elements.forEach(e => {
                if (typeof e.remove == 'function') {
                    e.remove();
                }
            });
        }
    },


    focus: class Focus extends Action {
        constructor () {
            super();
            this.title = 'Focus element';
            this.color = '#FFF';
            this.info = 'Focus element using .focus() method';
        }

        validate({ target }) {
            if (target.elements.length > 1) {
                return [{ type: 'warning',
                          text: "'Focus': should be used with a single element" }];
            }
        }

        run ({ target }) {
            target.elements.forEach(el => {
                if (typeof el.focus == 'function') {
                    this.el = el;
                }
            });
        }

        onScenarioEnd (app) {
            if (this.el) {
                this.el.focus();
                this.el = null;
            }
        }
    },

    trigger_events: class TriggerEvents extends Action {
        constructor () {
            super();
            this.title = 'Trigger events';
            this.color = '#F0F';
            this.info = 'Arguments are event names, e.g. "click", "mouseover" (no need to specify "on" prefix).';
        }

        validate ({ args }) {
            if (args.some(e => e.startsWith('on'))) {
                return [{ type: 'warning',
                          text: "'Trigger events': Use events without 'on' prefix, e.g. 'click' and not 'onclick'" }];
            }
        }

        run ({ target, args }) {
            for (let element of target.elements) {
                for (let event of args) {
                    triggerEvent(event, element);
                }
            }
        }
    },

    set_value: class SetValue extends Action {
        constructor () {
            super();
            this.title = "Set value";
            this.color = '#4CC';
            this.info = "Set 'value' property.";
        }

        validate ({ args }) {
            if (args.length > 1) {
                return [{ type: 'warning',
                          text: "'Set value' action accepts 0 or 1 arguments" }];
            }
        }

        run ({ target, args, app }) {
            const value = args[0] || '';
            let errors = false;
            for (let el of target.elements) {
                if (safeMatches(el, 'input[type=checkbox],input[type=radio]')) {
                    el.checked = !!value;
                } else if (safeMatches(el, 'input, textarea')) {
                    el.value = value;
                } else {
                    errors = true;
                }
            }
            if (errors) {
                app.messages.add('"Set value": some elements do not have the "value" property to set');
            }
        }
    },

    download: class Download extends Action {
        constructor () {
            super();
            this.title = 'Download url';
            this.color = '#CCC';
            this.info = '';
        }

        async run ({ target, args, app }) {
            let err = false;
            for (let element of target.elements) {
                let filename = args.filter(x => x != 'saveAs')[0];
                const res = (await getProperty(element, ['currentSrc', 'src', 'href']));
                const url = res.value;
                if (res.property == 'href') {
                    filename = filename || addSuffix(element.textContent, '.html');
                }
                if (url) {
                    const saveAs = args.includes('saveAs');
                    app.rpc.execute({ call: 'browser.downloads.download',
                                      arguments: [ { url, filename, saveAs } ] });
                    // Promise rejection may happen because the user closed the save dialog.
                    // That's why no await here. It's OK to ignore this.
                } else {
                    err = true;
                }
            }
            !err || app.messages.add('No URL to download');
        }
    },

    copy_contents: class CopyContents extends Action {
        constructor () {
            super();
            this.title = 'Copy contents';
            this.color = '#FFF';
            this.info = 'Copy contents. Arguments define a list of properties to read. Supported properties are: ' +
                getProperty.supportedProps.join(', ');
            this.shouldAwait = true;
        }

        async run({ target, args, app }) {
            let finalValue = null;
            let finalProperty = null;
            const props = args;

            for (let element of target.elements) {
                let { value, property } = await getProperty(element, props);
                if (value !== null) {
                    finalValue = value;
                    finalProperty = property;
                    break;
                }
            }

            if (finalValue !== null) {
                if ('imageData' == finalProperty) {
                    await app.rpc.execute({ call: 'imageToClipboard',
                                            arguments: [finalValue]});
                } else {
                    let input = document.createElement('input');
                    input.value = finalValue;
                    document.body.appendChild(input);
                    input.select();
                    document.execCommand("copy");
                    input.remove();
                }

                const slice = (str, n) => {
                    if (str.length <= n) {
                        return str;
                    } else {
                        return str.substr(0, n) + '…';
                    }
                };

                app.messages.add({ type: 'info',
                                   text: `Copied property ${finalProperty} to clipboard: ${slice(finalValue, 50)}` });
            } else {
                app.messages.add({ type: 'warning',
                                   text: "'Copy contents': no contents to copy" });
            }
        }
    },

    toggle_pause: class TogglePause extends Action {
        constructor () {
            super();
            this.title = 'Toggle pause';
            this.color = '#C9F';
            this.info = 'Works with video and audio elements';
        }

        validate ({ args, target })  {
            return doesNotAccept(args, this)
                .concat(requiresTags(target.elements, ['VIDEO', 'AUDIO'],
                                     elements => "'Toggle Pause': " + (elements.length > 1 ?
                                                                       "some of the elements are" :
                                                                       "the element is") + " not a video/audio."));
        }

        run({ target, args, app }) {
            target.elements.forEach(el => {
                // No need to check whether the element is of correct type
                try {
                    if (el.paused == true) {
                        el.play();
                    } else {
                        el.pause();
                    }
                } catch (e) {}
            });
        }
    },

    mute: class Mute extends Action {
        constructor () {
            super();
            this.title = 'Mute media';
            this.color = '#F66';
            this.info = 'Works with video and audio elements';
        }

        validate ({ args, target })  {
            return doesNotAccept(args, this)
                .concat(requiresTags(target.elements, ['VIDEO', 'AUDIO'],
                                     elements => "'Mute': " + (elements.length > 1 ?
                                                               "some of the elements are" :
                                                               "the element is") + " not a video/audio."));
        }

        run({ target }) {
            target.elements.forEach(el => {
                if (typeof el.muted == 'boolean') {
                    el.muted = !el.muted;
                }
            });
        }
    },
};

module.exports = class Actions {
    constructor (app) {
        Object.keys(actions).forEach(actionName => {
            this[actionName] = new actions[actionName](app);
            this[actionName].app = app;
        });
    }
};
