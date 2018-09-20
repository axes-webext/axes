
module.exports = {
    load: async function (reset = false) {
        let settings = (await browser.storage.local.get({ settings: null })).settings;

        if (reset) {
            if (!await this.check(settings)) {
                await this.reset();
                return await this.load(false);
            }
        }

        return settings;
    },

    initialize: function () {
        this.load(true);
    },

    save: async function (settings, reset = true) {
        if (reset) {
            if (!await this.check(settings)) {
                this.reset();
            }
        }
        return browser.storage.local.set({ settings: settings });
    },

    /** Stub */
    reset: async function () {
        /*
        await this.save(defaults, false);
        */
    },

    /** Stub */
    check: async function (settings) {
        return true;
    },
}
