async function getProperty (element, props = ['value', 'src', 'href', 'textContent']) {
    const r = {
        value: null,
        property: null,
    };

    if ('string' == typeof props) {
        props = props.split(',').map(s => s.trim());
    }

    for (let prop of props) {
        if (['value', 'src', 'href', 'textContent', 'currentSrc'].includes(prop)) {
            if (typeof element[prop] != 'undefined') {
                r.value = element[prop];
                r.property = prop;
                break;
            }
        }

        if ('imageData' == prop && 'IMG' == element.tagName) {
            r.property = prop;
            r.value = element.src;
            break;
        }

        if ('dataURL' == prop && 'IMG' == element.tagName) {
            const canvas = document.createElement("canvas");
            canvas.width = element.width;
            canvas.height = element.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(element, 0, 0, element.width, element.height);
            r.value = canvas.toDataURL("image/png");
            r.property = prop;
            break;
        }

        if ('originalDataURL' == prop && 'IMG' == element.tagName) {
            const canvas = document.createElement("canvas");
            r.property = prop;
            try {
                image = new Image();
                image.src = element.src;
                await new Promise((resolve, reject) => {
                    image.onload = () => {
                        canvas.width = image.width;
                        canvas.height = image.height;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(element, 0, 0, image.width, image.height);
                        resolve();
                    };
                    image.onerror = reject;
                });
                r.value = canvas.toDataURL("image/png");
            } finally {
                r.value = r.value || null;
            }
            break;
        }
    }
    return r;
}

getProperty.supportedProps = ['value', 'src', 'href', 'textContent', 'imageData', 'dataURL', 'originalDataURL'];

module.exports = getProperty;
