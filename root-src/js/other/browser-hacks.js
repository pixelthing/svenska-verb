var isSafari = /constructor/i.test(window.HTMLElement);
if (isSafari) {
    document.querySelector('html').classList.add('safari');
}