/** Given a list of labels and an object with 'from' and 'to' properties,
    returns a list consisting of labels that appear in the labels array between interval.from
    and interval.to (inclusively).
    If one of the labels is absent in the labels array, returns [].
    If the 'from' label does not precede the 'to' label in the labels array, returns [].
*/
module.exports = labels => interval => {
    const r = [];
    let flag = false;
    for (let label of labels) {
        if (interval.from == label) {
            flag = true;
        }
        if (flag) {
            r.push(label);
            if (interval.to == label) {
                return r;
            }
        }
    }
    if (flag) {
        return [];
    }
};
