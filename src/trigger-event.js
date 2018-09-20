module.exports = function triggerEvent (eventName, elem) {
    if (document.createEvent) {
	var evt = document.createEvent('HTMLEvents');
	evt.initEvent(eventName, true, true);
	return elem.dispatchEvent(evt);
    }
    /* if (elem.fireEvent)
	return elem.fireEvent('on' + eventName); */
};
