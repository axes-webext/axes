const select = require('./select');
const fromInterval = require('./from-interval');

module.exports =
    (obj, labels) =>
    select(string => [string], fromInterval(labels))(obj);
