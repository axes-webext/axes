module.exports = (selector) => {
    try {
        return Array.from(document.querySelectorAll(selector));
    } catch (e) {
        return [];
    };
};
