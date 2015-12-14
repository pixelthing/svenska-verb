var pageLockController = function () {

    var modalOffset = null;

    // DETAIL

    var lockPage = function() {
        modalOffset = document.querySelector('[data-js-verbs-list]').scrollTop;
        document.querySelector('[data-js-verbs-list]').classList.add('vListLocked');
        document.querySelector('[data-js-verbs-list]').style.top = '-' + modalOffset + 'px';
        //document.querySelector('html').addEventListener('click', pageLockController.backgroundClick);
    }

    var unLockPage = function() {
        document.querySelector('[data-js-verbs-list]').classList.remove('vListLocked');
        document.querySelector('[data-js-verbs-list]').scrollTop = modalOffset;
        document.querySelector('[data-js-verbs-list]').style.top = 'auto';
        modalOffset = null;
        //document.querySelector('html').addEventListener('click', pageLockController.backgroundClick);
    }

    // wehn pageLock is active, a background click (that isn't within the pageLock) will unlock the page and trigger the closure of any modals/menus
    var backgroundClick = function(ev) {
        console.log('1111')
        //var $this = $(ev.target);
        //if ($this.is('[data-js-pageLock-el]') || $this.closest('[data-js-pageLock-el]').length > 0) {
        //    return;
        //}
        //pageLockController.unLockPage();
    }

    // CLOSURE

    return {
        lockPage: lockPage,
        unLockPage: unLockPage
    }

}();