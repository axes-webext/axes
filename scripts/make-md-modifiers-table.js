const modifiers = require('../src/default-settings').modifiers;
const actions = new (require('../src/actions'))();

console.log('Modifier | Meaning');
console.log('---------|---------');
Object.keys(modifiers).forEach(key => {
    const mod = modifiers[key];
    console.log(key ? '`' + ((key.length > 1) ? '` `'+key+'` `' : key) + '`' : '(none)',
                '|', mod.map(({ action, user_args, args }) =>
                             actions[action].title + (args.length ? ' (' + args.join(', ') + ')' : '')
                            ).join(', '));
});
