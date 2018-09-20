/** Class that represents an action. Should be extended for use. */
module.exports = class Action {
    constructor () {
        this.title = 'Default action title';
        this.color = '#FFF';
        this.info = 'Default action info';
        this.messages = [];
        this.args = [];
        this.shouldAwait = false;
    }

    /** Should return a list of error objects. This method shouldn't be
        redefined - define validateArguments and validateElements separately. */
    validate ({ args, target, app }) {
        return (this.validateArguments(args, app) || [])
            .concat(this.validateElements(target.elements) || []);
    }
    validateArguments (/* args, app */) {
        return [];
    }
    validateElements (/* elements */) {
        return [];
    }
    /** Run action */
    run (/* { elements, args } */) {
    }

    /** Runs before scenario processing */
    onScenarioStart () {
    }

    /** Runs after scenario processing */
    onScenarioEnd (app) {
        this.messages.forEach(message => app.messages.remove(message));
    }

    /** Runs before each command when processing scenario */
    onCommandStart () {
    }

    /** Runs after each command when processing scenario */
    onCommandEnd () {
    }

    /** Runs after this action gets mentioned in the user input */
    onAdd () {
    }

    /** Runs after the user removes mention of this event */
    onRemove () {
    }

    addMessage (app, message) {
        const m = app.messages.add(message);
        this.messages.push(m);
        return m;
    }
};
