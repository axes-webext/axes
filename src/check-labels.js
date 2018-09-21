const select = require('./select');
const fromInterval = require('./from-interval');

const noLabel = label =>
      ({ type: 'error', text: `No such label: ${label}` });

module.exports =
    (obj, labels) => {
        let r = [];
        select(
            string => {
                if (!labels.includes(string)) {
                    r.push(noLabel(string));
                }
                return [];
            },

            interval => {
                [interval.from, interval.to]
                    .filter(x => !labels.includes(x))
                    .map(x => r.push(noLabel(x)));

                if (!r.length && !fromInterval(labels)(interval).length) {
                    r.push({
                        type: 'error',
                        text: `Label ${interval.to} does not follow up label ${interval.from}`
                    });
                }
                return [];
            }
        )(obj);
        return r;
    };
