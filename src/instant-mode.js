const InteractiveMode = require('./interactive-mode');

module.exports = class InstantMode extends InteractiveMode {
    constructor (app) {
        super(app);
        this.name = 'instant';
        this.isInstant = true;
    }
};
