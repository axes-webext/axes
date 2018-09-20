// Elem.matches may throw error if the selector is incorrect
module.exports = function safeMatches (elem, selector) {
    try {
        return elem.matches(selector);
    } catch (e) {
        return false;
    }
}
