module.exports = class MessageManager {
    constructor (app) {
        this.app = app;
        this.container = null;
        this.messages = {};
        this.counter = 1;
    }

    clear () {
        if (this.container !== null) {
            this.container.remove();
            this.container = null;
            this.messages = {};
        }
    }

    getId (sth) {
        if (typeof sth == 'object') {
            return sth.id;
        }
        if (typeof sth == 'number') {
            return sth;
        }
        return null;
    }

    remove (sth) {
        const id = this.getId(sth);
        if (this.exists(id)) {
            this.messages[id].container.remove();
            delete this.messages[id];
        }
    }

    byId (sth) {
        let id = this.getId(sth);
        return this.messages[id] || null;
    }

    exists (sth) {
        if (!sth)
            return false;
        let id = this.getId(sth);
        return this.messages.hasOwnProperty(id);
    }

    add (sth) {
        const fix = (sth) => {
            if (typeof sth == 'string') {
                sth = { type: 'info', text: sth };
            }
            if (typeof sth.text != 'string') {
                sth.text = sth.text + '';
            }

            sth.id = this.counter;
            return sth;
        };

        const message = fix(sth);

        let container;
        if (this.container === null) {
            container = this.container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.right = '0';
            container.style.float = 'right';
            container.style.fontSize = '10px';
            container.style.textAlign = 'right';
            container.style.zIndex = 2147483647;
            container.style.maxHeight = '100%';
            container.style.overflow = 'auto';
            document.body.appendChild(container);
        } else {
            container = this.container;
        }

        let bg = '#FF9';
        let border = 'yellow';
        switch (message.type) {
            case 'error':
                border = '#F00';
                bg = '#FCC';
                break;
            case 'warning':
                border = '#990';
                bg = '#FF0';
                break;
            case 'info':
                bg = '#CCF';
                border = '#55F';
                break;
        }

        const messageDivContainer = message.container = document.createElement('div');
        messageDivContainer.style.clear = 'both';

        const messageDiv = message.element = document.createElement('div');
        messageDiv.textContent = message.text;
        messageDiv.style.paddingLeft = '3px';
        messageDiv.style.paddingRight = '3px';
        messageDiv.style.fontSize = '10px';
        messageDiv.style.fontFamily = 'monospace';
        messageDiv.style.display = 'block';
        messageDiv.style.float = 'right';
        messageDiv.style.borderTop = '2px solid ' + border;
        messageDiv.style.borderLeft = '2px solid ' + border;
        messageDiv.style.backgroundColor = bg;
        messageDiv.style.clear = 'both';
        messageDiv.style.color = 'black';

        messageDiv.addEventListener('mouseenter', () => {
            const cross = document.createElement('span');
            cross.textContent = 'x';
            cross.style['font-family'] = 'monospace';
            cross.style['font-size'] = '30px';
            cross.style.cursor = 'pointer';
            cross.style.color = 'red';
            cross.style.background = 'none';
            cross.style.border = 'none';
            message.element.appendChild(cross);
            message.element.style.position = 'relative';
            message.cross = cross;
            cross.style.position = 'absolute';
            cross.style.top = '0';
            cross.style.right = '0';
            cross.addEventListener('click', () => {
                this.remove(message.id);
            });
        });

        messageDiv.addEventListener('mouseleave', () => {
            message.cross.remove();
        });

        messageDiv.addEventListener('click', () => {
            this.remove(message.id);
        });

        messageDivContainer.appendChild(messageDiv);
        container.appendChild(messageDivContainer);
        this.counter++;
        this.messages[message.id] = message;
        return message;
    }
}
