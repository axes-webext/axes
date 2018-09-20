const stringToRegExp = require('./string-to-regexp');

module.exports = function match (input, pattern) {
    const { type, value } = pattern;
    if (type.substr(0, 4) === 'not-') {
        return !match(input, { value, type: type.substr(4) });
    }

    switch (type) {
    case 'contain':
        return !!~input.indexOf(value);

    case 'start':
        return input.startsWith(value);

    case 'match':
        return input === value;

    case 'match-regexp':
        var res = stringToRegExp(value);
        return null === res ? false : res.test(input);

    case 'match-domain':
        var res = input.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
        return res ? res[1] === value : false;
    }

    return false;
};
