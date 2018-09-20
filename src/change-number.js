const extractNumbers = require('./extract-numbers');

module.exports = (f, input, at) => {
    for (let { length, index, value } of extractNumbers(input)){
        if (at >= index && at <= index + length) {
            return input.substr(0, index) + f(value) + input.substr(index + length);
        }
    }
    return input;
};
