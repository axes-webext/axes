const InteractiveMode = require('./interactive-mode');

module.exports = class InputMode extends InteractiveMode {
    constructor (app) {
        super(app);
        this.name = 'input';
        this.isInstant = false;
    }
};
