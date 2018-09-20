const Settings = require('../../src/settings');
const defaults = require('../../src/default-settings');
const Actions = new (require('../../src/actions'))({});
const T4ble = require('./t4ble');
const defs = require('./defs');
const validator = require('../../src/settings-validate');
const addElementOptions = require('./element-options');
const stringToRegExp = require('../../src/string-to-regexp');
const { saveAs } = require('file-saver/FileSaver');
const Sortable = require('sortablejs');

// Syntactic sugar
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const createElement = tag => document.createElement(tag);


// Mapping from tabName to objects containing 'open' property, which is a
// function that opens the corresponding tab.
const tabs = {};


Settings.check = function (settings) {
    for (let key of Object.keys(defaults)) {
        if(!(key in settings)) {
            return false;
        }
    }
    validator(settings);
    if (validator.errors !== null) {
        return false;
    }
    return true;
};

document.addEventListener("DOMContentLoaded", loadAll);
document.addEventListener("DOMContentLoaded", addEventListeners);
document.addEventListener("DOMContentLoaded", foldTabs);
document.addEventListener("DOMContentLoaded", addTitles);

const loadSectionsList = [loadGeneral,
                          loadModifiers,
                          loadAutodetection,
                          loadHotkeys,
                          loadSelectors,
                          loadStartupPreferences,
                          loadKeyMaps,
                          loadJSON];
const saveSectionsList = [saveGeneral,
                          saveHotkeys,
                          saveModifiers,
                          saveAutodetection,
                          saveStartupPreferences,
                          saveKeyMaps,
                          saveSelectors];

function loadAll() {
    return Settings.load(true)
                   .then(settings => {
                       loadSectionsList.forEach(f => f(settings));
                   })
                   .catch(console.log);
}

function addNotification (elem, text) {
    if (!(elem instanceof Element)) {
        return;
    }
    const oldTextContent = elem.textContent;
    elem.textContent = text;
    elem.disabled = true;
    setTimeout(() => {
        elem.disabled = false;
        elem.textContent = oldTextContent;
    }, 1000);
}

async function resetAll () {
    if (confirm('Do you really want to reset the settings?')) {
        await Settings.reset();
        await loadAll();
    }
}

function reloadSections(sections, successText = 'done', errorText = 'error') {
    return evt => {
        Settings.load().then(settings => {
            sections.forEach(f => f(settings));
            addNotification(evt.target, successText);
        }).catch(e => {
            addNotification(evt.target, errorText);
        });
    };
}

function resetSections (ls, ss) {
    return async evt => {
        try {
            let settings = await Settings.load();
            if (confirm("Reset to defaults?")) {
                // Load from defaults
                ls.forEach(f => f(defaults));
                // Save from reloaded sections
                ss.forEach(f => settings = f(settings));
                await Settings.save(settings);
            }
            addNotification(evt.target, 'done');
        } catch (e) {
            addNotification(evt.target, 'error');
            throw new Error(e);
        }
    };
}

function addEventListeners () {
    function saveSections (functions) {
        return async e => {
            let elem = e.target;
            try {
                const settings = await Settings.load();
                functions.forEach(f => f(settings));
                validator(settings);
                await Settings.save(settings, false);
                addNotification(elem, "saved");
                loadJSON(settings);
            } catch (e) {
                addNotification(elem, "error");
            }
        };
    }

    [
        ['all',           saveSectionsList,       loadSectionsList],
        ['general',       saveGeneral,            loadGeneral],
        ['modifiers',     saveModifiers,          loadModifiers],
        ['hotkeys',       saveHotkeys,            loadHotkeys],
        ['autodetection', saveAutodetection,      loadAutodetection],
        ['selectors',     saveSelectors,          loadSelectors],
        ['startup',       saveStartupPreferences, loadStartupPreferences],
        ['keymaps',       saveKeyMaps,            loadKeyMaps],
    ].forEach(([name, ss, ls]) => {
        // lift to singletones
        const fix = x => (!(x instanceof Array)) ? [x] : x;
        ss = fix(ss); ls = fix(ls);

        $('#reset-' + name).addEventListener('click', resetSections(ls, ss));
        $('#reload-' + name).addEventListener('click', reloadSections(ls));
        $('#save-' + name).addEventListener('click', saveSections(ss));
    });

    $('#reload-json').addEventListener('click', reloadSections([loadJSON]));
    $('#save-json').addEventListener('click', async e => {
        try {
            await saveJSONSettings(e.target);
        } catch (e) {
            addNotification(e.target, 'error');
        }
    });

    $('#backup-download').addEventListener('click', downloadBackup);
    $('#backup-upload').addEventListener('click', () => {
        $('#backup-upload-input').click();
    });
    $('#backup-upload-input').addEventListener('change', evt => {
        const reader = new FileReader();
        reader.onload = async evt => {
            try {
                const settings = JSON.parse(evt.target.result);
                if (Settings.check(settings)) {
                    await Settings.save(settings);
                    await loadAll();
                } else {
                    throw new Error(settings);
                }

                addNotification($('#backup-upload'), 'success');
            } catch (e) {
                // Assuming the config size will never reach 1e6
                if (evt.target.result.length > 1e6) {
                    alert('Invalid settings backup! (file is too large)');
                    return;
                }
                const answer = confirm('Invalid settings backup! Do you want to review it using JSON editor?');
                if (answer) {
                    $('#json-settings').value = evt.target.result;
                    tabs['JSON settings'].open();
                }
            }
        };
        reader.readAsText(evt.target.files[0]);
    });
}

/* General settings */
function loadGeneral (settings) {
    $('#on-scroll').value = settings.labels.on_scroll;
    $('#exit-on-resize').checked = settings.labels.exit_on_resize;
    $('#autoclose-quotes').checked = settings.autoclose_quotes;
    $('#autoclose-brackets').checked = settings.autoclose_brackets;
    $('#input-position').value = settings.input_top ? 'top' : 'bottom';

    const alphabet = $('#label-alphabet');
    alphabet.value = settings.labels.alphabet;
    const validateInput = addInputValidation(alphabet,
                                             value => /^[a-z0-9]+$/g.test(value));

    $('#label-aplhabet-presets').innerHTML = '';
    for (let [title, content] of defs.alphabet_presets) {
        const l = createElement('span');
        l.className = 'label-alphabet-preset';
        l.textContent = title;
        l.onclick = function () {
            alphabet.value = content;
            validateInput({ target: alphabet });
        };
        $('#label-aplhabet-presets').appendChild(l);
    }

    $('#label-font').value = settings.labels.font;
    $('#label-fill-color').value = settings.labels.fill_color;
    $('#label-text-color').value = settings.labels.text_color;
    $('#label-blinking-interval').value = settings.labels.blink_interval;
    [].forEach.call($$('.label-padding'), (e, i) => {
        e.value = parseInt(settings.labels.padding[i]) || 0;
        addInputValidation(e, value => value >= 0);
    });

    addInputValidation($('#label-font'),
                       value => {
                           $('#label-font-preview').style.font = value;
                           return true;
                       });
    addEventsToColorInput($('#label-fill-color'));
    addEventsToColorInput($('#label-text-color'));
    addInputValidation($('#label-blinking-interval'),
                       value => !isNaN(parseInt(value)) && value >= 16);
}

function saveGeneral (settings) {
    settings.labels.on_scroll = $('#on-scroll').value;
    settings.labels.exit_on_resize = $('#exit-on-resize').checked;
    settings.autoclose_quotes = $('#autoclose-quotes').checked;
    settings.autoclose_brackets = $('#autoclose-brackets').checked;
    settings.input_top = $('#input-position').value == 'top';

    if (!validFields($('#labels-container'))) {
        throw "labels";
    }
    settings.labels.alphabet = $('#label-alphabet').value;
    settings.labels.font = $('#label-font').value;
    settings.labels.fill_color = $('#label-fill-color').value;
    settings.labels.text_color = $('#label-text-color').value;
    settings.labels.blink_interval = parseInt($('#label-blinking-interval').value);
    [].forEach.call($$('.label-padding'), (e, i) => {
        settings.labels.padding[i] = parseInt(e.value);
    });

    return settings;
}

/* Modifiers */
function loadModifiers (settings) {

    function getModifierRow (settings, mod, actions, required = false) {
        let mod_str = mod ? mod : required ? '(none)' : '';
        const container = new T4ble([], { className: 'modifier-actions'});

        const addAction = (action, args, user_args) => {
            const s = createElement('select');
            s.style.display = 'block';
            s.className = 'action-action';
            appendActionsToSelect(s);
            s.value = action ? action : 'autodetect';

            const addArgButton = createElement('a');
            addArgButton.classList.add('add-argument');
            addArgButton.classList.add('link');
            addArgButton.textContent = 'add';
            addArgButton.addEventListener('click', evt => {
                const newInput = createElement('input');
                newInput.classList.add('argument-input');
                const parent = evt.target.parentNode.parentNode.parentNode.getElementsByClassName('argument-table')[0];
                const table = new T4ble(parent);
                table.addRow([newInput, getRemoveButton()]);
            });

            const ua = createElement('select');
            addOptionsToSelect(ua, {
                'ignore': "Ignore",
                'accept': "Accept",
                'append': "Append",
                'prepend': "Prepend",
                'warn': "Warn",
                'error': "Reject",
            });
            ua.value = user_args;
            ua.classList.add('user-arguments');

            const selectContainer = createElement('div');
            selectContainer.appendChild(s);
            selectContainer.appendChild(getRemoveButton({ title: 'Remove action', depth: 6 }));
            selectContainer.style.display = 'flex';

            container.addRow([
                new T4ble([
                    // select action, remove action
                    [selectContainer],
                    // default arguments, add arguments
                    [['Default arguments: ', addArgButton]],
                    // list of arguments
                    [new T4ble(args.map(arg => {
                        const input = createElement('input');
                        input.value = arg;
                        input.classList.add('argument-input');

                        return [input, getRemoveButton({ title: 'Remove argument' })];
                    }), { className: 'argument-table' })],
                    [['User arguments: ', ua]],
                ], { className: 'action-table' }),
            ]);
        };

        const modifier = createElement(required ? 'span' : 'input');
        modifier.className = 'action-modifier light-green';
        modifier[required ? 'textContent' : 'value'] = mod_str;
        if (!required) {
            addInputValidation(modifier, value => {
                return /^[a-z0-9]+$/g.test(value) &&
                       [].filter.call($$('.action-modifier'),
                                      e => e.value == value).length == 1;
            }, false);
        }
        modifier.dataset.mod = mod;

        actions.forEach(t => addAction(t.action, t.args, t.user_args));

        const addActionButton = createElement('a');
        addActionButton.classList.add('add-action');
        addActionButton.classList.add('link');
        addActionButton.textContent = 'add action';
        addActionButton.addEventListener('click', () => {
            addAction('', [], 'accept');
        });

        const removeButton = required ? '' : getRemoveButton({ title: 'Remove modifier',
                                                               textContent: 'remove',
                                                               depth: 5 });
        return [new T4ble([[modifier],
                           [removeButton]])
              , container
              , addActionButton ];
    }

    let tbl = [];
    let container = $('#modifiers-container');
    container.innerHTML = '';

    defs.all_modifiers.forEach(mod => {
        if (settings.modifiers.hasOwnProperty(mod)) {
            tbl.push(getModifierRow(settings, mod, settings.modifiers[mod], true));
        } else {
            tbl.push(getModifierRow(settings, mod, [], true));
        }
    });

    Object.keys(settings.modifiers).forEach(mod => {
        if (!defs.all_modifiers.includes(mod)) {
            tbl.push(getModifierRow(settings, mod, settings.modifiers[mod], false));
        }
    });

    let table = new T4ble(tbl);


    table.tableElement.id = 'modifiers-table';
    table.appendTo(container);

    let nb = createElement('button');
    nb.textContent = 'Add';
    container.appendChild(nb);
    nb.onclick = function () {
        table.addRow(getModifierRow(settings, '', [], false));
    };
}

function saveModifiers (settings) {
    const table = $('#modifiers-table');
    if (!validFields(table))
        throw 'modifiers';

    settings.modifiers = {};
    table.childNodes.forEach(row => {
        const modEl = row.getElementsByClassName('action-modifier')[0],
              mod = modEl.dataset.mod || modEl.value || '';
        const actions = [];

        Array.from(row.getElementsByClassName('action-table'))
             .forEach(actionTable => {
                 const args = Array.from(actionTable.getElementsByClassName('argument-input')).map(e => e.value);
                 const action = actionTable.getElementsByClassName('action-action')[0].value;
                 const user_args = actionTable.getElementsByClassName('user-arguments')[0].value;
                 actions.push({ action, args, user_args });
             });

        settings.modifiers[mod] = actions;
    });

    return settings;
}


/* Action autodetection */
function loadAutodetection (settings) {

    function getAutodetectionRow (selector, action) {
        let s = createElement('input');
        s.className = 'autodetection-selector';
        s.value = selector;
        addSelectorValidation(s);

        let act = createElement('select');
        act.className = 'autodetection-action';
        appendActionsToSelect(act, { noAutodetect: true });
        act.value = action;

        return [getHandle(), s, act, getRemoveButton({ title: 'Remove rule' })];
    }

    const tbl = [],
        container = $('#autodetection-container');

    container.innerHTML = '';

    for (const t of settings.autodetection) {
        tbl.push(getAutodetectionRow(t.selector, t.action));
    }

    const table = new T4ble(tbl);
    table.tableElement.id = 'autodetection-table';
    table.appendTo(container);
    makeSortable(table);

    const nb = createElement('button');
    nb.textContent = 'Add';
    container.appendChild(nb);
    nb.onclick = function () {
        new T4ble($('#autodetection-table')).addRow(getAutodetectionRow('*', 'click'));
    };
}

function saveAutodetection (settings) {
    if (!validFields($('#autodetection-table'))) {
        throw "autodetection";
    }
    settings.autodetection = [];
    $('#autodetection-table').childNodes.forEach(row => {
        const selector = row.getElementsByClassName('autodetection-selector')[0].value;
        const action = row.getElementsByClassName('autodetection-action')[0].value;
        settings.autodetection.push({ selector, action });
    });
    return settings;
}

/* Hotkeys */
function loadHotkeys (settings) {
    function getHotkeysRow (binding, global, prevent, action, value, i) {
        const b = createElement('button');
        b.className = 'hotkey-button';
        b.textContent = binding;
        b.addEventListener('click', function () {
            b.textContent = '...';
            b.classList.add('hotkey-recording');
            Mousetrap.record(function (sequence) {
                b.textContent = sequence.join(' ');
                b.classList.remove('hotkey-recording');
            });
        });

        const c = createElement('input');
        c.type = 'checkbox';
        c.id = 'hotkeys-global-checkbox-' + i;
        c.className = 'hotkeys-global-checkbox';
        c.checked = global;

        const l = createElement('label');
        l.textContent = 'global';
        l.title = 'Fire the event even if the focus currently belongs to an editable element (input, textarea, etc.)';
        l.htmlFor = 'hotkeys-global-checkbox-' + i;

        const p = createElement('input');
        p.type = 'checkbox';
        p.id = 'hotkeys-prevent-checkbox-' + i;
        p.className = 'hotkeys-prevent-checkbox';
        p.checked = prevent;

        const lp = createElement('label');
        lp.textContent = 'prevent default';
        lp.title = "Prevent default effect of the hotkey (e.g. for 'ctrl+s' do not show dialog, for input fields do not change the value)";
        lp.htmlFor = 'hotkeys-prevent-checkbox-' + i;

        const s = createElement('select');
        s.className = 'hotkey-action';
        addOptionsToSelect(s, getHotkeyOptionsObj());
        s.value = action;

        const v = createElement('input');
        v.className = 'hotkey-value';
        v.placeholder = 'Value (optional)';
        v.value = !!value ? value : '';

        return [b, new T4ble([[[c, l]], [[p, lp]]]), s, v, getRemoveButton({ title: 'Remove hotkey' })];
    }

    function getHotkeyOptionsObj () {
        let r = {};
        defs.hotkey_actions.forEach(
            ([name, descr]) => r[name] = descr
        );
        return r;
    }

    let tbl = [];
    let i = 0;
    let container = $('#hotkeys-container');

    container.innerHTML = '';

    for (const t of settings.hotkeys) {
        tbl.push(getHotkeysRow(t.binding, t.global, t.preventDefault, t.action, t.value, i));
        i++;
    }

    const table = new T4ble(tbl);
    table.tableElement.id = 'hotkeys-table';
    table.appendTo(container);

    const nb = createElement('button');
    nb.textContent = 'Add';
    container.appendChild(nb);
    nb.onclick = function () {
        const table = $('#hotkeys-table');
        new T4ble(table).addRow(getHotkeysRow('space', false, false, 'start-input', '', table.childNodes.length));
    };
}

function saveHotkeys (settings) {
    settings.hotkeys = getFromRows($('#hotkeys-table'), {
        binding: '.hotkey-button',
        action:  '.hotkey-action',
        global: '.hotkeys-global-checkbox',
        preventDefault: '.hotkeys-prevent-checkbox',
        value: '.hotkey-value',
    });
    return settings;
}

/* Selectors */
function loadSelectors (settings) {

    function getSelectorsRow (selector) {
        const sel = createElement('select');
        addOptionsToSelect(sel, defs.match_types);
        sel.value = selector.pattern.type;
        sel.classList.add('selector-match-type');

        const input = createElement('input');
        input.value = selector.pattern.value;
        input.classList.add('selector-input');
        addInputValidation(input, (value, evt) => {
            let select = evt.target.parentNode.parentNode.getElementsByClassName('selector-match-type')[0];
            if (select.value.includes('regexp')) {
                return (stringToRegExp(value) !== null);
            } else {
                return true;
            }
        });

        const act = createElement('select');
        addOptionsToSelect(act, defs.selector_actions);
        act.classList.add('selector-action');
        act.value = selector.action;

        const textarea = createElement('textarea');
        textarea.value = selector.selector;
        textarea.classList.add('selector-textarea');
        addSelectorValidation(textarea);
        return [getHandle(),
                new T4ble([
                    [new T4ble([['If', sel, input],
                                ['then', act]])
                    ],
                    [textarea]
                ]),
                getRemoveButton({ title: 'Remove rule' })
        ];
    }

    const container = $('#selectors-container');
    container.innerHTML = '';
    const tbl = [];

    for (const selector of settings.selectors) {
        tbl.push(getSelectorsRow(selector));
    }

    const table = new T4ble(tbl);
    table.tableElement.id = 'selectors-table';
    table.appendTo(container);
    makeSortable(table);

    const nb = createElement('button');
    nb.textContent = 'Add';
    container.appendChild(nb);
    nb.onclick = function () {
        new T4ble($('#selectors-table')).addRow(getSelectorsRow(defaults.selectors[0]));
    };
}

function saveSelectors (settings) {
    const table = $('#selectors-table');
    if (!validFields(table)) {
        throw "selectors";
    }

    settings.selectors = getFromRows(table, {
        type: '.selector-match-type',
        pattern: '.selector-input',
        action: '.selector-action',
        selector: '.selector-textarea',
    }).map(r => ({
        pattern: { type: r.type, value: r.pattern },
        action: r.action,
        selector: r.selector
    }));

    return settings;
}

/* Startup preferences */
function loadStartupPreferences (settings) {
    function getStartupPreferencesRow (pattern, action, value) {
        let t = createElement('select');
        t.className = 'startup-pattern-type';
        addOptionsToSelect(t, defs.match_types);
        t.value = pattern.type;

        let p = createElement('input');
        p.value = pattern.value;
        p.className = 'startup-pattern-value';
        p.placeholder = 'Pattern';

        let a = createElement('select');
        addOptionsToSelect(a, defs.startup_actions);
        a.className = 'startup-action';
        a.value = action;

        let v = createElement('input');
        v.value = value;
        v.className = 'startup-value';
        v.style.width = '140px';
        v.placeholder = 'Value (optional)';

        return [getHandle(), new T4ble([['If', t, p], ['then', a, v, getRemoveButton({ depth: 5 })]])];
    }

    const tb = [];
    const container = $('#startup-container');
    container.innerHTML = '';

    for (const pref of settings.startup_preferences) {
        tb.push(getStartupPreferencesRow(pref.pattern, pref.action, pref.value));
    }

    const tbl = new T4ble(tb);
    tbl.appendTo(container);
    tbl.tableElement.id = 'startup-table';
    const sortable = makeSortable(tbl);

    const nb = createElement('button');
    nb.textContent = 'Add';
    container.appendChild(nb);
    nb.onclick = function () {
        new T4ble($('#startup-table')).addRow(getStartupPreferencesRow({
            type: 'match-domain', value: 'example.com'
        }, 'turn-off', ''));
    };
}


function saveStartupPreferences (settings) {
    settings.startup_preferences =
        getFromRows($('#startup-table'),
                    {
                        pattern: {
                            type: '.startup-pattern-type',
                            value: '.startup-pattern-value',
                        },
                        action: '.startup-action',
                        value: '.startup-value',
                    });
    return settings;
}

/* Keymaps */
function loadKeyMaps (settings) {
    const container = $('#keymap-container');
    container.innerHTML = '';
    new T4ble(Object.keys(defs.keymaps).map(name => {
        const c = createElement('input');
        c.type = 'checkbox';
        c.checked = settings.keymap_preferences.includes(name);
        c.name = 'keymap-' + name;
        c.id = 'keymap-' + name;

        const l = createElement('label');
        l.htmlFor = 'keymap-' + name;
        l.textContent = defs.keymaps[name].title;

        return [c, l];
    })).appendTo(container);
}

function saveKeyMaps (settings) {
    settings.keymap = {};
    settings.keymap_preferences = [];
    Object.keys(defs.keymaps).forEach(name => {
        if ($('#keymap-' + name).checked) {
            const keymap = defs.keymaps[name].keymap;
            settings.keymap_preferences.push(name);
            Object.keys(keymap).forEach(key => {
                settings.keymap[key] = keymap[key];
            });
        }
    });
    return settings;
}

function addEventsToColorInput (input) {
    if (input.dataset.withIndicator) return;
    const sample = createElement('span');
    sample.className = 'color-indicator color-sample';
    input.parentNode.insertBefore(sample, input);
    input.parentNode.insertBefore(input, sample);
    input.dataset.withIndicator = 'true';
    const f = function () {
        sample.style.backgroundColor = input.value;
    };

    f();
    input.addEventListener('keyup', f);
}


/* JSON */
function loadJSON (settings) {
    $('#json-settings').value = JSON.stringify(settings, null, 4);
}

async function saveJSONSettings (target) {
    const container = $('#json-settings-errors');
    container.innerHTML = '';

    try {
        const settings = JSON.parse($('#json-settings').value);

        validator(settings);

        if (validator.errors !== null) {
            updateJSONErrorList(validator.errors, container);
            addNotification(target, 'error');
            return;
        }

        Settings.save(settings).then(() => addNotification(target, 'saved'));
    } catch (e) {
        updateJSONError(e, container);
        addNotification(target, 'error');
    }
}

function updateJSONErrorList (errors, container) {
    new T4ble(errors.map(error => {
        let message = error.message;
        if (typeof error.params == 'object' && error.params.allowedValues) {
            message += `. Allowed values: ${error.params.allowedValues.join(', ')}`;
        }
        return ['settings' + error.dataPath, message];
    })).appendTo(container);
}

function updateJSONError (error, container) {
    const textarea = $('#json-settings');
    const message = createElement('b');

    message.textContent = error.message;
    container.appendChild(message);

    // Move textarea selection to the first error
    try {
        let [line, position] = error.message.match(/[0-9]+/g);

        for (const char of Array.from(textarea.value)) {
            if (char == '\n') {
                line--;
            }
            if (line == 1) {
                break;
            }
            position++;
        }
        setSelectionRange(textarea, position, position);
    } catch (e) {
    }
}

async function downloadBackup () {
    const settings = await Settings.load(true);
    const blob = new Blob([JSON.stringify(settings, null, 4)],
                          { type: "text/plain;charset=utf-8" });
    saveAs(blob, 'axes-config-' + new Date().toISOString().substr(0, 10) + '.json');
}

/* Helper functions */

function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
        const range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

function getRemoveButton (opts = {}) {
    const button = createElement(opts.textContent ? 'button' : 'div');
    button.classList.add(opts.textContent ? 'button' : 'remove-button');
    opts.depth = opts.depth || 2;
    button.textContent = opts.textContent || '';
    button.onclick = function () {
        let n = opts.depth;
        let el = this;
        while (n > 0) {
            el = el.parentNode;
            n--;
        }
        el.remove();
    };
    addElementOptions(button, opts);
    return button;
}

function appendActionsToSelect (select, opts = {}) {
    // add all available <option>s to <select>
    Object.keys(Actions).forEach(act => {
        if (opts.noAutodetect) {
            if (act == 'autodetect') {
                return;
            }
        }
        const o = createElement('option');
        o.textContent = Actions[act].title;
        o.title = Actions[act].info;
        o.value = act;
        select.appendChild(o);
    });
}

function addOptionsToSelect (sel, opts, func = () => {}) {
    for (const opt in opts) {
        if (opts.hasOwnProperty(opt)) {
            const o = createElement('option');
            o.value = opt;
            o.textContent = opts[opt];
            sel.appendChild(o);
            func(o);
        }
    }
    return sel;
}

function addSelectorValidation (input) {
    addInputValidation(input, (value) => {
        try {
            document.body.matches(value);
        } catch (e) {
            return false;
        }
        return true;
    });
}

function addInputValidation (input, predicate, check = true) {
    const validate = evt => {
        if (predicate(input.value, evt)) {
            input.classList.remove('invalid-input');
        } else {
            input.classList.add('invalid-input');
        }
    };

    input.addEventListener('keyup', validate);
    input.addEventListener('click', validate);
    input.addEventListener('change', validate);

    if (check) {
        try {
            validate({ target: input });
        } catch (e) {
        }
    }
    return validate;
}

function getHandle () {
    const handle = createElement('div');
    handle.className = 'sortable-handle';
    return handle;
}

function makeSortable (table) {
    if (table instanceof T4ble) {
        table = table.tableElement;
    }

    return Sortable.create(table, { animation: 200,
                                    draggable: 'tr',
                                    handle: '.sortable-handle' });
}

function getFromRows(table, props) {
    const r = [];
    const keys = Object.keys(props);
    for (let row of table.childNodes) {
        let obj = {};
        let values = keys.map(key => {
            if (typeof props[key] == 'string') {
                let elem = row.querySelector(props[key]);
                if (elem.tagName == 'BUTTON') {
                    return elem.textContent;
                } else {
                    if (elem.type == 'checkbox') {
                        return elem.checked;
                    } else {
                        return elem.value;
                    }
                }
            } else if (typeof props[key] == 'object') {
                return getFromRows(table, props[key])[0];
            }
        });
        keys.forEach((key, i) => {
            obj[key] = values[i];
        });
        r.push(obj);
    }
    return r;
}

function validFields (element) {
    return !element.querySelector('.invalid-input');
}

/* Tabs */

function foldTabs () {
    const container = $('#tabs-container');
    [].forEach.call($$('.sect'), el => {
        const title = el.getElementsByClassName('sect-title')[0].textContent;
        const topButtons = !!el.getElementsByClassName('no-top-buttons').length;
        const tab = createElement('span');
        tab.className = 'tab';
        tab.textContent = title;
        tabs[title] = {};
        tab.onclick = tabs[title].open = () => {
            [].forEach.call($$('.tab'), el => el.classList.remove('tab-selected'));
            tab.classList.add('tab-selected');
            hideTabs();
            el.classList.remove('tab-inactive');

            // If 'User manual' tab is selected, hide buttons
            $('#top-buttons').style.display = topButtons ? 'none' : 'block';
        };
        container.appendChild(tab);
    });
    hideTabs();
    $('.tab').click();
}

function hideTabs () {
    [].forEach.call($$('.sect'), el => {
        el.classList.add('tab-inactive');
    });
}

/* Titles */

const titles = {
    '.save': 'Save settings on this tab',
    '.reload': 'Reload all settings on this tab',
    '.reset': 'Reset all settings on this tab to default values',
    '.restore': 'Restore config from file',
    '.backup': 'Save current state of configuration to file',
};

function addTitles () {
    Object.keys(titles).forEach(selector => {
        $$(selector).forEach(el => {
            el.title = el.title || titles[selector];
        });
    });
}
