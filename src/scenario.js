// Example parsedInput:
//  [{ commands: [{ modifier: '!', args: []},
//                { modifier: 'd', args: ['c', 'b']}],
//     target: { type:'label', value:'a' } }]
const selectLabels = require('./select-labels');
const selectSelectors = require('./select-selectors');
const checkLabels = require('./check-labels');
const Report = require('./report');

/** Dummy clone, do not use anywhere else */
const clone = (obj) => {
    if (null == obj || "object" != typeof obj) return obj;
    let copy = obj.constructor();
    for (let attr in obj) {
        if (obj.hasOwnProperty(attr))
            copy[attr] = clone(obj[attr]);
    }
    return copy;
};

module.exports = class Scenario {
    constructor(app) {
        this.app = app;
        this.scenario = [];
        this.oldUsedActs = {};
    }

    from (parsedInput) {
        this.scenario = parsedInput;
        return this;
    }

    get hasTargets () {
        return this.scenario.some(({ target: { type } }) => type != 'none');
    }

    validateBefore (labelManager) {
        const report = new Report();

        for (let { commands, target } of this.scenario) {
            let type = target.type;
            let value = target.value;

            // Check if all labels exist
            if (type == 'label') {
                report.add(checkLabels([value], labelManager.labelList));
            } else if (type == 'intervals') {
                report.add(checkLabels(value, labelManager.labelList));
            } else if (type == 'selector') {
                try {
                    document.body.querySelector(value);
                } catch (_) {
                    report.addError('Invalid selector: "' + value + '"');
                }
            }

            // Check if all modifiers exist and if their settings allow user-specified arguments
            for (let { modifier, args } of commands) {

                if (!(modifier in this.app.settings.modifiers)) {
                    report.addError('No such modifier: ' + modifier);
                    continue;
                }

                const actions = this.app.settings.modifiers[modifier];
                if (args.length > 0) {
                    for (let action of actions) {
                        if (action.user_args == 'warn') {
                            report.addWarning('User-specified arguments are forbidden for modifier ' + modifier);
                        } else if (action.user_args == 'error') {
                            report.addError('User-specified arguments are forbidden for modifier ' + modifier);
                        }
                    }
                }

            }
        }
        return report;
    }

    validateAfter () {
        const report = new Report();
        // Actions that appear in this scenario
        const usedActs = {};

        // Validate actions
        for (let { commands, target } of this.scenario) {
            let type = target.type;
            let value = target.value;
            for (let { modifier, args } of commands) {
                const actions = (this.app.settings.modifiers[modifier]);
                for (let { action: actionName, args: actionArgs } of actions) {
                    let action = this.app.actions[actionName];

                    usedActs[actionName] = true;

                    let validationErrors = action.validate({ args: actionArgs, app: this.app, target });
                    if (validationErrors instanceof Array) {
                        report.add(validationErrors);
                    }
                }
            }
        }

        // Trigger onRemove on actions that was removed
        Object.keys(this.oldUsedActs).forEach(action => {
            if (!usedActs[action]) {
                this.app.actions[action].onRemove(this.app);
            }
        });

        // Trigger onAdd for newly added actions
        Object.keys(usedActs).forEach(action => {
            if (!this.oldUsedActs[action]) {
                this.app.actions[action].onAdd(this.app);
            }
        });

        // Remember current state
        this.oldUsedActs = usedActs;
        return report;
    }

    normalize (labelManager, report) {
        const report1 = this.validateBefore(labelManager);
        report.addFrom(report1);

        if (!report1.hasErrors) {
            this.scenario.forEach(({ commands, target }) => {
                commands = this.normalizeCommands(commands);
                target = this.normalizeTarget(target, labelManager);
            });

            const report2 = this.validateAfter();
            report.addFrom(report2);
        }
        return this;
    }

    normalizeTarget(target, labelManager) {
        target.elements = [];
        target.labels = [];
        const getElByLabel = label => labelManager.labels[label].element;

        switch (target.type) {
        case 'label':
            target.labels = [target.value];
            target.elements = [getElByLabel(target.value)];
            break;
        case 'intervals':
            target.labels = selectLabels(target.value, labelManager.labelList);
            target.elements = target.labels.map(getElByLabel);
            break;
        case 'selectors':
            target.elements = selectSelectors(target.value, document);
            break;
        }
        return target;
    }

    normalizeCommands (commands) {
        const modifiers = this.app.settings.modifiers;
        commands.forEach(command => {
            if (typeof command.modifier == 'string' &&
                modifiers[command.modifier] instanceof Array) {
                const actions = command.actions = clone(modifiers[command.modifier]);
                // Propagate command arguments to actions according to the rules
                if (command.args.length !== 0) {
                    actions.forEach(action => {
                        switch (action.user_args) {
                        case 'accept':
                            action.args = command.args;
                            break;
                        case 'append':
                            action.args = action.args.concat(command.args);
                            break;
                        case 'prepend':
                            action.args = command.args.concat(action.args);
                            break;
                        }
                    });
                }
            }
        });
        return commands;
    }

    async run () {

        const trigger = (what) => {
            Object.keys(this.app.actions).forEach(action => {
                this.app.actions[action][what](this.app);
            });
        };

        trigger('onScenarioStart');

        for (let { commands, target } of this.scenario) {
            for (let { actions } of commands) {
                trigger('onCommandStart');

                for (let { action: actionName, args } of actions) {
                    if (actionName in this.app.actions) {
                        const action = this.app.actions[actionName];
                        if (action.shouldAwait) {
                            await action.run({ args, target, app: this.app });
                        } else {
                            action.run({ args, target, app: this.app });
                        }
                    }
                    // else - no action
                }
                trigger('onCommandEnd');
            }
        }

        trigger('onScenarioEnd');
    }
};
