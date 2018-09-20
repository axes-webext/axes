module.exports = class Report {
    constructor () {
        this.messages = [];
        this.hasErrors = false;
    }
    get empty () {
        return this.messages.length == 0;
    }
    addError (text) {
        this.hasErrors = true;
        this.messages.push({ type: 'error', text });
    }
    addWarning (text) {
        this.messages.push({ type: 'warning', text });
    }
    add (m) {
        if (m instanceof Array) {
            m.forEach(e => this.add(e));
        } else if (m.type == 'error') {
            this.addError(m.text);
        } else if (m.type == 'warning') {
            this.addWarning(m.text);
        }
    }
    // Load messages from another report, without changing them;
    addFrom (report) {
        if (report instanceof Report) {
            report.messages.forEach(m => this.add(m));
        } else {
            throw "Report.addFrom: argument must be a Report instance";
        }
    }
}
