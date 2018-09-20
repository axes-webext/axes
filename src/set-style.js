module.exports = (el, obj) => {
    Object.keys(obj).forEach(prop => {
        el.style[prop] = obj[prop];
    });
}
