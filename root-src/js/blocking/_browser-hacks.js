var isSafari = /constructor/i.test(window.HTMLElement);
if (isSafari) {
    document.querySelector('html').classList.add('safari');
}

var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
if (isAndroid) {
    document.querySelector('html').classList.add('android');
}

var isWM = /iemobile/i.test(navigator.userAgent.toLowerCase());
if (isWM) {
    document.querySelector('html').classList.add('winMob');
}