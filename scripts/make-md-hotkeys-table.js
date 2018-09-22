const hotkeys = require('../src/default-settings').hotkeys;
const actions = new (require('../src/actions'))();
const hotkey_actions = require('../settings/js/defs').hotkey_actions;

console.log('Hotkey | Meaning | Global | Prevents default | Value');
console.log('---------|---------|------------|----------|---------');
hotkeys.forEach(({ binding, action, global, preventDefault, value }) => {
    console.log(`\`${binding}\` | ${hotkey_actions[action]} | ${global} | ${preventDefault} | ${value}`);
});
