const setStyle = require('./set-style.js');

module.exports =
    /** Add input field to the DOM
        @param app - app object */
function addInput (app) {
    const input = document.createElement('textarea'),
          container = document.createElement('div');

    setStyle(container, app.settings.input_container_style);
    setStyle(input,     app.settings.input_style);
    container.appendChild(input);
    document.body.appendChild(container);

    const span = document.createElement('div');
    span.style.display = 'inline-block';

    // Autoresize
    input.addEventListener('keyup', () => {
        const maxWidth = window.innerWidth - 100;
        const minWidth = 300;
        const maxHeight = window.innerHeight;

        let width = 0;
        let height = 0;

        const style = window.getComputedStyle(input);
        const lines = input.value.split('\n');
        ['Size', 'Style', 'Family'].forEach(what => {
            span.style[`font${what}`] = style[`font${what}`];
        });

        // Find correct width and height.
        // Width is maximum of line widths.
        // Height equals to the height of the last line
        document.body.appendChild(span);
        lines.forEach(line => {
            // If the input is empty, do not set height to 0
            span.textContent = line || '-';

            const bcr = span.getBoundingClientRect();
            height = bcr.height;
            if (bcr.width > width) {
                width = bcr.width;
            }
        });
        span.remove();

        // Prevent blinking when typing long words
        // (this may happen due to word wrapping)
        width += parseInt(span.style.fontSize);
        height = height * lines.length + 5;

        width = ((width > maxWidth) ?
                 maxWidth :
                 (width < minWidth) ?
                 minWidth :
                 width) + 'px';
        height = (height > maxHeight ?
                  maxHeight : height) + 'px';

        setStyle(input, { width, height });
    });
    return { input, container };
};
