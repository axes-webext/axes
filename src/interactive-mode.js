const addInput = require('./add-input');
const inputParser = require('./input-parser');
const getParserStateAt = require('./get-parser-state-at');
const changeNumber = require('./change-number');

const LabelManager = require('./label-manager');
const SelectorManager = require('./selector-manager');
const Scenario = require('./scenario');
const Report = require('./report');

function parse (value) {
    return inputParser.parse(value, { startRule: 'start' });
}

function preventDefault (e) {
    e.preventDefault();
}

function replaceSelectedText (el, text) {
    el.value = el.value.slice(0, el.selectionStart) + text + el.value.slice(el.selectionEnd);
}

/** An abstract class. Extended at './input-mode.js'  and './instant-mode.js' */
module.exports = class InteractiveMode {
    constructor(app) {
        /* This will never happen anyway.
        if (this.constructor === InteractiveMode) {
            throw new TypeError('Abstract class cannot be instantiated directly');
        } */
        this.app = app;
        this.messageList = [];
        this.scenario = new Scenario(app);

        this.exitHandler = (evt) => {
            this.app.modeSwitcher.disable();
        };

        this.restoreHandler = (evt) => {
            this.app.modeSwitcher.disable();
            setTimeout(() => this.app.modeSwitcher.enter(this.name), 1000);
        };
    }

    setValue (value) {
        this.input.value = value;
    }

    enable (app) {
        this.labelManager = new LabelManager(this.app, this.isInstant);
        this.selectorManager = new SelectorManager();
        this.labelManager.addLabels();

        const { input, container } = addInput(this.app);
        this.input = input; this.container = container;

        input.focus();

        window.addEventListener('DOMMouseScroll',
                                { 'prevent': preventDefault,
                                  'exit': this.exitHandler,
                                  'restore': this.restoreHandler }[this.app.settings.labels.on_scroll]);

        window.addEventListener('resize',
                                this.app.settings.labels.exit_on_resize ?
                                this.exitHandler : this.restoreHandler);
        input.onblur = evt => this.app.modeSwitcher.disable();

        input.addEventListener('keydown', evt => {
            const caretPosition = input.selectionStart;
            let key = evt.key;
            // Alt+Up/Down, Ctrl+Up/Down
            const bindings = { 'ArrowUp': x => x + 1,
                               'ArrowDown': x => x > 0 ? x - 1 : x };

            if (key in bindings) {
                if (evt.ctrlKey) {
                    container.style.top = container.style.top != '' ? '' : '0px';
                    evt.preventDefault();
                    return;
                }

                if (evt.altKey) {
                    input.value = changeNumber(bindings[key], input.value, caretPosition);
                    input.setSelectionRange(caretPosition, caretPosition);
                    evt.preventDefault();
                    return;
                }
            }

            // Keymap
            const state = getParserStateAt(input.value, caretPosition - 1);
            const keymap = this.app.settings.keymap;

            if (!state.string && key.length == 1 &&
                !evt.ctrlKey && !evt.altKey && !evt.metaKey) {
                // It is assumed that keymap maps non-latin chars into
                // latin ones.
                if (key in keymap) {
                    key = keymap[key];
                }

                if (key.charCodeAt(0) < 127 && key.toLowerCase() != key) {
                    key = key.toLowerCase();
                }
                const brackets = { '{': '}', '[': ']' };
                if (this.app.settings.autoclose_quotes && "'`".includes(key)) {
                    key += key;
                } else if (this.app.settings.autoclose_brackets && key in brackets) {
                    key += brackets[key];
                }

                evt.preventDefault();
                evt.stopPropagation();

                replaceSelectedText(input, key);
                input.setSelectionRange(caretPosition + 1, caretPosition + 1);
            }

            if ([46, 8].includes(evt.keyCode) && '' == input.value) {
                this.app.modeSwitcher.disable();
            }
        });

        // Escape pasted text if needed
        input.addEventListener('paste', evt => {
            const caretPosition = input.selectionStart;
            const clipboardData = (evt.clipboardData ||
                                   evt.originalEvent.clipboardData ||
                                   window.clipboardData).getData('text');
            let escaped = [].map.call(clipboardData,
                                      c => ~"'\\".indexOf(c) ? "\\" + c : c).join('');
            const state = getParserStateAt(input.value, caretPosition - 1);

            if (!state.string) {
                if (!state.escape) {
                    escaped = "'" + escaped;
                }
                escaped += "'";
            }
            // Add closing quote if there is no text right to the caret.
            else if (caretPosition == input.value.length) {
                escaped += "'";
            }

            evt.stopPropagation();
            evt.preventDefault();

            replaceSelectedText(input, escaped);
            input.setSelectionRange(caretPosition, caretPosition + escaped.length);
        });

        input.addEventListener('keyup', this.handleInput.bind(this));
    }

    run () {
        this.app.modeSwitcher.disable();
        this.clearMessages();
        this.scenario.run();
    }

    showReport (report) {
        this.clearMessages();
        report.messages.forEach(message => {
            this.addMessage(message);
        });
    }

    handleInput (evt) {
        const inputValue = this.input.value;

        // Exit on escape
        if (evt.keyCode == 27) {
            this.app.modeSwitcher.disable();
            return;
        }

        // Run on enter
        if (evt.keyCode == 13 && !evt.shiftKey && !evt.ctrlKey &&
            !this.report.hasErrors) {
            this.run();
            return;
        }

        // Do not update if nothing has changed
        if (this.lastInputValue == inputValue) {
            return;
        }
        this.lastInputValue = inputValue;

        let parsedInput = [];
        const report = this.report = new Report();

        try {
            parsedInput = parse(inputValue);
        } catch (error) {
            this.setStatus('error');
            this.clearMessages();
            if ('location' in error) {
                const pos = error.location.start.line + ':' + error.location.start.column;
                report.addError(`Parse error at ${pos}: ${error.message}`);
            }
            this.labelManager.update([]);
            this.selectorManager.update([]);
            this.showReport(report);
            throw error;
        }

        try {

            const scenario = this.scenario;
            scenario.from(parsedInput)
                    .normalize(this.labelManager, report);
            this.setStatus(report.empty ? 'valid' :
                           report.hasErrors ? 'error' : 'warning');

            if (!report.hasErrors) {
                this.labelManager.update(scenario.scenario);
                this.selectorManager.update(scenario.scenario);
                if (this.isInstant && this.scenario.hasTargets) {
                    this.run();
                    return;
                }
            } else {
                this.labelManager.update([]);
                this.selectorManager.update([]);
            }
        } catch (error) {
            this.setStatus('error');
            this.labelManager.update([]);
            this.selectorManager.update([]);
        }

        this.showReport(report);
    }

    addMessage(message) {
        this.messageList.push(this.app.messages.add(message));
    }

    disable () {
        window.removeEventListener('DOMMouseScroll', preventDefault);
        window.removeEventListener('DOMMouseScroll', this.restoreHandler);
        window.removeEventListener('DOMMouseScroll', this.exitHandler);
        window.removeEventListener('resize', this.exitHandler);
        window.removeEventListener('resize', this.restoreHandler);

        document.body.focus();
        this.input.onblur = undefined;
        this.input.blur();
        this.input.remove();
        this.clearMessages();
        this.container.remove();
        this.labelManager.removeLabels();
        this.selectorManager.clear();
    }

    clearMessages () {
        this.messageList.forEach(messageId => this.app.messages.remove(messageId));
        this.messageList = [];
    }

    setStatus (status) {
        const prefs = { warning: '#FC0', error: 'red' };
        this.input.style['border-top-color'] =
            status in prefs ? prefs[status] : 'white';
    }
};
