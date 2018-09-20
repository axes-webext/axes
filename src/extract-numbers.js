/** Extracts numbers from given string */
module.exports = str => {
    const r = [];
    const re = /[0-9]+/;
    let shift = 0;
    while (re.test(str)) {
        const res = re.exec(str);
        const index = res.index;
        const length = res[0].length;
        const step = index + length;
        r.push({ index: shift + index, length, value: parseInt(res[0]) });
        str = str.substr(step);
        shift += step;
    }
    return r;
};
