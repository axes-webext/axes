const addElementOptions = require('./element-options');

module.exports = class T4ble {
    constructor (tbl, opts = {}) {
        if (tbl instanceof Array) {
            this.tableArray = tbl;
            this.tableElement = document.createElement('table');
            this.normalizeTree();
            this.addElements();
        } else if (tbl instanceof Element && tbl.tagName == 'TABLE'){
            this.loadTable(tbl);
        }
        addElementOptions(this.tableElement, opts);
    }

    // Load table cells from given element;
    loadTable (tbl) {
        this.tableArray = Array.from(tbl.childNodes)
                               .map(tr => Array.from(tr.childNodes)
                                               .map(td => Array.from(td.childNodes)));
        this.tableElement = tbl;
    }

    appendTo (elem) {
        elem.appendChild(this.tableElement);
        return this;
    }

    createCellFrom (sth) {
        if (sth instanceof Element) {
            return [sth];
        } else if (sth instanceof T4ble) {
            return this.createCellFrom(sth.tableElement);
        } else if (sth instanceof Array) {
            return [].concat.apply([], sth.map(this.createCellFrom));
        } else if (typeof sth === 'string' || sth instanceof String) {
            return [document.createTextNode(sth)];
        } else if (sth instanceof NodeList) {
            sth = Array.from(sth);
            this.createCellFrom(sth);
        } else if (sth === null) {
            return [];
        } else if (sth instanceof Node) {
            return [sth];
        } else if (sth instanceof T4ble) {
            return this.createCellFrom(sth.unwrap());
        } else {
            throw new Error("t4ble: couldn't use object" + typeof sth);
        }
    }

    normalizeTree () {
        this.tableArray = this.tableArray.map(this.normalizeRow.bind(this));
    }

    normalizeRow (row) {
        return row.map(this.createCellFrom.bind(this));
    }

    addElements () {
        this.tableArray.forEach(row => {
            this.tableElement.appendChild(this.makeRow(row));
        });
    }

    makeRow (row) {
        var tr = document.createElement('tr');
        row = this.normalizeRow(row);
        row.forEach(elems => {
            var td = document.createElement('td');
            elems.forEach(el => {
                td.appendChild(el);
            });
            tr.appendChild(td);
        });
        return tr;
    }

    addRow (row) {
        row = this.normalizeRow(row);
        this.tableArray.push(row);
        this.tableElement.appendChild(this.makeRow(row));
    }

    unwrap () {
        return this.tableElement;
    }
};
