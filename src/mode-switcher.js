class InactiveMode {
    constructor () {
        this.name = 'inactive';
    }
    enable () {
    }
    disable () {
    }
}

module.exports = class ModeSwitcher {
    constructor (app) {
        this.app = app;
        this.modes = {};
        this.add(InactiveMode);
        this.currentMode = new InactiveMode();
    }

    add (Mode) {
        let mode = new Mode(this.app);
        this.modes[mode.name] = Mode;
    }

    setValue () {
        this.currentMode.setValue.apply(this.currentMode, arguments);
    }

    async enter (modeName) {
        if (this.currentMode.name == modeName) {
            return;
        }
        if (modeName in this.modes) {
            await this.currentMode.disable();
            const Mode = this.modes[modeName];
            const mode = new Mode(this.app);
            await mode.enable(this.app);
            this.currentMode = mode;
        } else {
            throw "No " + modeName + " in ModeSwitcher.modes";
        }
    }

    async disable () {
        if (this.currentMode.name != 'inactive') {
            await this.currentMode.disable();
            this.currentMode = new InactiveMode();
        }
    }
}
