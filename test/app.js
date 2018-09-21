const delay = require('delay');
const proxyquire = require('proxyquire');
const assert = require('assert');
const reset = () => {
    global.chrome = {};
    require('jsdom-global')();
};

const trigger = (el, evtName, opts) => {
    el.dispatchEvent(new KeyboardEvent(evtName, opts));
};

reset();

describe('interactive scenarios', function () {
    class MouseStub {
        constructor () {
            this.bs = {};
        }
        bind (key, f) {
            this.bs[key] = f;
        }
        bindGlobal (key, f) {
        }
        unbind(key) {
        }
        trigger (key) {
            let evt = document.createEvent("HTMLEvents");
            evt.initEvent("keyup", false, true);
            document.body.dispatchEvent(evt);
            this.bs[key](evt);
        }
    };

    global.Mousetrap = new MouseStub();
    const App = () => proxyquire('../src/content.js', {
        './settings': {
            load: async function (reset = false) {
                let r = require('../src/default-settings');
                r.modifiers['click'] = [ { action: 'click',
                                           user_args: 'ignore',
                                           args: [] } ];
                return r;
            }
        },
        './rpc-client': class RPCClientStub {
            constructor () {
            }
            execute(message) {
                return new Promise((resolve, reject) => {
                    reject();
                });
            }
        }
    });

    describe('element presence', () => {
        it('entering input-mode adds textarea', () => {
            reset();
            document.body.innerHTML = '<a>foo</a><a>bar</a>';
            const app = App();
            return app.then(() => Mousetrap.trigger('f')).then(() => {
                assert.equal(document.querySelectorAll('textarea').length, 1);
            });
        });

        it('entering instant-mode adds textarea', () => {
            reset();
            document.body.innerHTML = '<a>foo</a><a>bar</a>';
            const app = App();
            return app.then(() => Mousetrap.trigger('shift+f')).then(() => {
                assert.equal(document.querySelectorAll('textarea').length, 1);
            });
        });
    });

    describe('selectors', () => {
        it('{a|2}`click`', () => {
            reset();
            document.body.innerHTML = '<a>foo</a><a>bar</a>';
            let flag = false;
            const l = document.createElement('a');
            l.onclick = () => flag = true;
            document.body.appendChild(l);
            const init = App();
            let app = null;
            return init.then(a => { app = a; Mousetrap.trigger('shift+f'); }).then(() => {
                return delay(10);
            }).then(() => {
                app.modeSwitcher.currentMode.input.value = '{a|2}`click`';
                trigger(app.modeSwitcher.currentMode.input, 'keyup', { key:'enter' });
                return delay(10);
            }).then(() => {
                assert.equal(flag, true, 'click event should happen');
            });
        });
    });


    describe('labels', () => {
        it('works', () => {
            reset();
            document.body.innerHTML = '<a style="display:block">foo</a><a style="display:block">bar</a>';
            let flag = false;
            const l = document.createElement('a');
            l.style.display = 'block';
            l.onclick = () => flag = true;
            document.body.appendChild(l);
            const init = App();
            let app = null;
            return init.then(a => { app = a; Mousetrap.trigger('shift+f'); }).then(() => {
                return delay(100);
            }).then(() => {
                Object.defineProperties(window.HTMLElement.prototype, {
                    offsetLeft: {
                        get: function() { return parseFloat(window.getComputedStyle(this).marginLeft) || 0; }
                    },
                    offsetTop: {
                        get: function() { return parseFloat(window.getComputedStyle(this).marginTop) || 0; }
                    },
                    offsetHeight: {
                        get: function() { return 50; }
                    },
                    offsetWidth: {
                        get: function() { return 50; }
                    }
                });
                Element.prototype.getBoundingClientRect = function () {
                    return { bottom: 100, height: 100, left: 100, right: 100, top: 100, width: 100 };
                };
                let el = app.selectorProcessor.getElements()[0];
                app.modeSwitcher.currentMode.labelManager.addLabels();
                app.modeSwitcher.currentMode.input.value = '`click`c';
                trigger(app.modeSwitcher.currentMode.input, 'keyup', { key: 'enter', shiftKey: false, ctrlKey: false });
                return delay(100);
            }).then(() => {
                assert.equal(flag, true, 'click event should happen');
            });
        });
    });
});
