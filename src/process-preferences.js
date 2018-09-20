const match = require('./match');

module.exports = app => {
    const result = { enabled: true, disabledHotkeys: [], mode: '',
                     modeValue: '' };
    for (let { pattern, action, value } of app.settings.startup_preferences) {
        if (match(document.location.href, pattern)) {
            switch (action) {
                case 'turn-on':
                    result.enabled = true;
                    break;
                case 'turn-off':
                    result.enabled = false;
                    break;
                case 'disable-hotkey':
                    result.disabledHotkeys.push(value);
                    break;
                case 'start-input':
                    result.mode = 'input';
                    result.modeValue = value;
                    break;
                case 'start-instant':
                    result.mode = 'instant';
                    result.modeValue = value;
                    break;
            }
        }
    }

    return result;
}
