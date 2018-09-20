const select = require('./select');
const safeQS = require('./safe-qs');

module.exports =
    (obj) =>
    select(({ value, patterns }) => {
        let elements = safeQS(value);
        let elemsLength = elements.length;
        if (patterns) {
            return [].concat(...patterns.map(entry => {
                if (entry.type === 'number') {
                    return [entry.value];
                } else {
                    // assert(entry.type === 'interval');
                    let [from, to] = [Math.min(entry.from, entry.to),
                                      Math.max(entry.from, entry.to)];
                    return new Array(to - from + 1).fill(0).map((_, i) => from + i);
                }
            }).map(arr => arr.filter(x => x < elemsLength)))
                .map(n => elements[n]);
        }
        return elements;
    }, /* interval => {
        throw 'impossible';
    } */)(obj);
