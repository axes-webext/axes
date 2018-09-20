module.exports = function (element, opts = {}) {
    if (!(element instanceof Element)) {
        throw "element-options: not an element!";
    }

    ['className', 'id', 'textContent', 'value', 'title', 'placeholder']
        .forEach(key => {
            if (key in opts) {
                element[key] = opts[key];
            }
        });

    ['style'].forEach(key => {
        if (key in opts && typeof opts[key] == 'object') {
            Object.keys(opts[key]).forEach(k => {
                element[key][k] = opts[key][k];
            });
        }
    });

    if (opts.classList instanceof Array) {
        opts.classList.forEach(c => {
            element.classList.add(c);
        });
    }
}
