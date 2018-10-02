const safeMatches = require('./safe-matches');

module.exports = class LabelManager {
    /**
       @param {boolean} sameLength - specifies how labels should be generated.
       i.e. for sameLength = false,
       labels should be like ['a', 'b', ..., 'z', 'aa', 'ab', ...]
       for sameLength = true,
       labels should be like ['aa', 'ab', ...]
    */
    constructor (app, sameLength) {
        this.app = app;
        this.sameLength = sameLength;
        this.canvas = null;
        this.labels = {};
        this.labelList = [];
    }

    /** Get all visible elements with their absolute positions */
    getVisibleElementPositions () {
        // Inline elements may wrap in many lines, so to get the real left position
        // of the given element, we need to create a temporary element, insert it
        // before given, compute the position and the immediately remove the element.
        function getInlineElementLeftOffset (elem) {
            let n = document.createElement('img'), r;
            // Some non-empty innerHTML is required. Otherwise if the given inline
            // element starts at new line, the temporary element will be inserted to the
            // previous line.
            n.innerHTML = '_';
            elem.parentNode.insertBefore(n, elem);
            r = n.getBoundingClientRect().left;
            n.remove();
            return r;
        }

        function isVisible (pos) {
            const w = window.innerWidth,
                  h = window.innerHeight,
                  min = 5;
            return pos.x < w &&
                   pos.x + pos.w > min &&
                   pos.y < h &&
                   pos.y + pos.h > min &&
                   pos.h > min && pos.w > min;
        }

        let elements = [];
        try {
            elements = this.app.selectorProcessor.getElements();
        } catch (e) {
            throw "Couldn't select elements: check settings.selector value in config";
        }

        let labels = elements.reduce((acc, el) => {
            const rect = el.getBoundingClientRect();
            const position = {
                x: rect.left,
                y: rect.top,
                w: el.offsetWidth,
                h: el.offsetHeight
            };


            if (!isVisible(position)) {
                return acc;
            }

            const style = window.getComputedStyle(el);
            if (style.display === 'inline') {
                position.x = getInlineElementLeftOffset(el);
            }

            position.element = el;
            acc.push(position);
            return acc;
        }, []);

        return labels;
    }

    addLabels () {
        this.addCanvas();
        const ctx = this.ctx = this.ctx || this.canvas.getContext('2d');
        ctx.font = this.app.settings.labels.font || '12px monospace';
        const height = ctx.measureText('m').width;
        let labelObjs = this.getVisibleElementPositions();
        const labels = this.getLabels(labelObjs);
        labelObjs.forEach((obj, i) => {
            obj.label = labels[i];
            obj.strokeStyle = this.getStrokeStyle(obj.element);
            obj.fillColors = [];
            obj.width = ctx.measureText(obj.label).width;
            obj.height = height;

            this.labels[obj.label] = obj;
            this.labelList.push(obj.label);
        });

        this.getCollidingLabelGroups();
        this.drawLabels(labelObjs);
        this.startBlinking();
    }

    /** Finds colliding label groups and puts them to this.colliding */
    getCollidingLabelGroups () {
        const getLength = (x1, y1, x2, y2) => {
            return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
        };

        const areColliding = (label1, label2) => {
            const o1 = this.labels[label1],
                  o2 = this.labels[label2],
                  dist = getLength(o1.x, o1.y, o2.x, o2.y);

            return dist < getLength(0, 0, o1.width, o1.height);
        };

        const colliding = this.colliding = {};
        const labelNames = Object.keys(this.labels);

        labelNames.forEach(label => {
            colliding[label] = [label];
        });

        loop1: for (let l1 of labelNames) {
            loop2: for (let l2 of labelNames) {
                if (l1 == l2) {
                    continue loop1;
                }

                if (l2 in colliding) {
                    for (const label of colliding[l2]) {
                        if (areColliding(l1, label)) {
                            colliding[l2].push(l1);
                            break loop2;
                        }
                    }
                }
            }
        }

        labelNames.forEach(label => {
            if (colliding[label].length === 1) {
                delete colliding[label];
            }
        });
    }

    /** Adds a timer that redraws labels in colliding groups */
    startBlinking () {
        this.blinkTimer = 1;

        if (Object.keys(this.colliding).length == 0) {
            this.blinkInterval = null;
            return;
        }

        this.blinkInterval = setInterval(() => {
            this.blinkTimer++;
            const redrawQueue = [];
            // In each group, at each tick, redraw one label.
            Object.values(this.colliding).forEach(labels => {
                redrawQueue.push(this.labels[labels[this.blinkTimer % labels.length]]);
            });
            this.drawLabels(redrawQueue);
        }, this.app.settings.labels.blink_interval || 600);
    }

    /** Iterates though settings.labels.stroke_styles to determine which to use. */
    getStrokeStyle (element) {
        const stroke_styles = this.app.settings
              .labels.stroke_styles.concat([{ selector: '*', style: '#555' }]);

        for (const { selector, style } of stroke_styles) {
            if (safeMatches(element, selector)) {
                return style;
            }
        }
    }

    addCanvas () {
        const canvas = this.canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.right = 0;
        canvas.style.bottom = 0;
        canvas.style.zIndex = 2147483647;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
    }

    /** Updates canvas state */
    drawLabels (labels) {
        const ctx = this.ctx = this.ctx || this.canvas.getContext('2d');
        const [topPad, leftPad, rightPad, bottomPad] =
            this.app.settings.labels.padding;
        const textFillStyle = this.app.settings.labels.text_color;
        const bgFillStyle = this.app.settings.labels.fill_color;
        ctx.font = this.app.settings.labels.font || '12px monospace';
        labels.forEach(({ x, y, width, height, fillColors, label, strokeStyle }) => {
            // Adding 0.5 prevents edge blurring
            x = Math.round(x) + 0.5;
            y = Math.round(y) + 0.5;

            width = Math.round(width);
            height = Math.round(height);

            if (!fillColors.length) {
                fillColors = [bgFillStyle];
            }

            const colorsCount = fillColors.length;
            const step = (width + leftPad + rightPad) / colorsCount;
            const finalHeight = height + topPad + bottomPad;
            const finalX = x - leftPad;
            const finalY = y - topPad;

            fillColors.forEach((color, i) => {
                ctx.fillStyle = color;
                ctx.fillRect(finalX, finalY, step * (colorsCount - i), finalHeight);
            });

            ctx.fillStyle = textFillStyle;
            ctx.fillText(label, x, y + height);

            // Draw rectangle box.
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(x - leftPad, y - topPad);
            ctx.lineTo(x + width + rightPad, y - topPad);
            ctx.lineTo(x + width + rightPad, y + height + bottomPad);
            ctx.lineTo(x - leftPad,  y + height + bottomPad);
            ctx.strokeStyle = strokeStyle;
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(x - leftPad, y + height + bottomPad);
            ctx.lineWidth = 3;
            ctx.lineTo(x - leftPad, y - topPad);
            ctx.stroke();
            ctx.closePath();
        });
    }

    /** Updates canvas state according to scenario */
    update (scenario) {
        const labels = {};
        const modifiers = this.app.settings.modifiers;
        Object.keys(this.labels).forEach(label => {
            this.labels[label].fillColors = [];
        });

        scenario.forEach(({ commands, target }) => {
            const processLabel = (label) => {
                if (label in this.labels) {
                    this.labels[label].fillColors = [];
                    commands.forEach(({ modifier }) => {
                        modifiers[modifier].forEach(({ action }) => {
                            if (!(action in this.app.actions)) {
                                return;
                            }
                            this.labels[label].fillColors.push(this.app.actions[action].color);
                        });
                    });
                }
            };

            if (target.type === 'label') {
                processLabel(target.value);
            } else if (target.type === 'intervals') {
                target.labels.forEach(processLabel);
            }
        });

        this.drawLabels(Object.values(this.labels));
    }

    /** Turn off */
    removeLabels () {
        if (this.canvas) {
            this.canvas.remove();
        }
        this.labels = {};
        this.labelList = [];
        clearInterval(this.blinkInterval);
    }

    /** Returns a list of label strings */
    getLabels (elements) {
        const alphabet = this.app.settings.labels.alphabet,
              length = alphabet.length;

        if (this.sameLength) {
            // This function generates a label of given length by given number
            // and alphabet.
            //
            // eg. for alphabet 'abc', length 4 and numbers from 0 to 14 the
            // function output should form the sequence [aaaa aaab aaac aaba ...]
            function getFixedLengthLabel (n, a, len) {
                let r = '';

                for (let i = 0; i < len; i++) {
                    r = a[n % a.length] + r;
                    n = (n - n % a.length) / a.length;
                }

                return r;
            }

            const r = [];
            const labelLength =
                Math.ceil(Math.log(elements.length) / Math.log(length));

            for (let i in elements) {
                r.push(getFixedLengthLabel(i, alphabet, labelLength));
            }

            return r;
        } else {
            // Generate a list of labels by given alphabet,
            // (think of alphabet length as a radix of n-ary number system)
            //
            // eg. for alphabet 'abc' and numbers from 0 to 14 the function output
            // should form this sequence:
            //
            //         a b c aa ab ac ba bb bc ca cb cc aaa aab
            let r = [];

            if (alphabet.length == 0) {
                throw "Empty alphabet!";
            }

            for (let n in elements) {
                let label = '';
                while (true) {
                    label = alphabet[n % length] + label;
                    n = (n - n % length) / length - 1;
                    if (n === -1) { break; }
                }
                r.push(label);
            }
            return r;
        }
    }
};
