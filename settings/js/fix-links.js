document.addEventListener('DOMContentLoaded', () => {
    [].map.call(document.querySelectorAll('a'), a => {
        let chunks = a.href.split('#');
        if (chunks.length > 1) {
            let id = chunks.pop();
            a.onclick = evt => {
                evt.preventDefault();
                document.querySelector('#' + id).scrollIntoView();
            };
        }
    });
});
