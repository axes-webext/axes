module.exports = (value, interval) =>
    function select (obj) {
        if (obj instanceof Array) {
            return [].concat.apply([], obj.map(select));
        } else if (obj.type === 'exclude') {
            if (obj.sub.hasOwnProperty('pattern')) {
                const pattern = obj.sub.pattern;
                const min = select(obj.min);
                let i = 0; let len = obj.sub.pattern.length;
                let r = [];
                min.forEach(l => {
                    if (pattern[i]) {
                        r.push(l);
                    }
                    i++;
                    i = i % len;
                });
                return r;
            } else {
                const sub = select(obj.sub);
                return select(obj.min)
                    .filter(e => !sub.includes(e));
            }
        } else if (obj.type === 'interval') {
            return interval(obj);
        } else {
            return value(obj);
        }
    };
