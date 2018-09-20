const difference = (a, b) => a.filter(e => !b.some(x => x == e));

module.exports = class SelectorManager {
    constructor () {
        this.map = new Map();
    }

    update (scenario) {
        let els = [];
        scenario.forEach(({ commands, target }) => {
            if (target.type == 'selectors') {
                els = els.concat(target.elements);
            }
        });

        const old = Array.from(this.map.keys());

        difference(old, els)
            .forEach(el => this.remove(el));

        difference(els, old)
            .forEach(el => this.add(el));
    }

    add (el) {
        if (this.map.has(el)) {
            return;
        }
        this.map.set(el, el.style.outline);
        el.style.outline = '1px dotted #444';
    }

    remove (el) {
        if (!this.map.has(el))
            return;
        if (el.style)
            el.style.outline = this.map.get(el);
        this.map.delete(el);
    }

    clear () {
        Array.from(this.map.keys())
            .forEach(el => this.remove(el));
    }
};
