const match = require('./match');
const safeQS = require('./safe-qs');

module.exports = class SelectorProcessor {
    constructor(app) {
        this.app = app;
    }

    getElements () {
        let include = [];
        let exclude = [];

        for (let { pattern: pattern, selector: selector, action: action } of this.app.settings.selectors) {
            if (match(document.location.href, pattern)) {
                if (action === 'include') {
                    include.push(selector);
                } else if (action === 'exclude') {
                    exclude.push(selector);
                } else if (action === 'set') {
                    include = [selector];
                    exclude = [];
                    break;
                } else if (action === 'add') {
                    include.push(selector);
                    break;
                }
            }
        }

        include = safeQS(include.join(','));
        exclude = exclude.join(',');

        if (exclude.length) {
            include = include.filter(elem => !elem.matches(exclude));
        }

        return include;
    }
};
