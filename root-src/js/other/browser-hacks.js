var isSafari = /constructor/i.test(window.HTMLElement);
console.log(isSafari)
if (isSafari) {
    document.querySelector('html').classList.add('safari');
}