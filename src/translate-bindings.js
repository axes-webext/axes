/** This module is used to translate Mousetrap.js bindings according to keymaps.
    Keymaps map primitive keys into localized ones. See tests for more info. */

const tokenize = str => {
    const r = [];
    let buf = '';
    [].forEach.call(str, (c, i) => {
        const special = [' ', '+'].includes(c);
        if (special) {
            if (buf) {
                r.push(buf);
                r.push(c);
                buf = '';
            } else {
                r.push(c);
            }
        } else {
            buf += c;
        }
    });

    if (buf)
        r.push(buf);

    return r;
};

const translate = (tokens, reverseMap) => {
    if (!tokens.length)
        return [[]];
    const x = tokens[0];
    const xs = tokens.slice(1);
    const tails = translate(xs, reverseMap);
    const r = [];
    [x, ...(x in reverseMap ? reverseMap[x] : [])].forEach(head => {
        tails.forEach(tail => {
            r.push([head, ...tail]);
        });
    });
    return r;
};

const translateBindings = (binding, keymap) => {
    const tokens = tokenize(binding);
    const reverseMap = {};
    Object.keys(keymap).forEach(key => {
        if (typeof reverseMap[keymap[key]] == 'undefined') {
            reverseMap[keymap[key]] = [];
        }
        reverseMap[keymap[key]].push(key);
    });

    return translate(tokens, reverseMap).map(tokens => tokens.join(''));
};

translateBindings.tokenize = tokenize;
translateBindings.translate = translate;

module.exports = translateBindings;
