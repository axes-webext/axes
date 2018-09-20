// Slightly modified version of
// https://raw.githubusercontent.com/darrin/node-string-to-regexp/master/string-to-regexp.js
module.exports = function stringToRegExp (string) {
    try {
        let m = /^\/(.*)\/([gimy]{0,4})$/.exec(string),
            regex = string, flags = '';

        if (m.length >= 2) {
            regex = m[1];
            flags = m.length === 3 ? m[2] : '';
        }

        return new RegExp(regex, flags);
    } catch (err) {
        return null;
    }
};
