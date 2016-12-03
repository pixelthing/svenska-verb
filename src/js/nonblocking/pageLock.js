var pageLockController = function () {

  var modalOffset = null;
  var verbsList = document.querySelector('[data-js-verbs-list]');

  // DETAIL

  var lockPage = function() {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
    if (viewportWidth < 768) {
      modalOffset = verbsList.scrollTop;
      verbsList.classList.add('vListLocked');
      verbsList.style.top = '-' + modalOffset + 'px';
    }
    //document.querySelector('html').addEventListener('click', pageLockController.backgroundClick);
  };

  var unLockPage = function() {
    verbsList.classList.remove('vListLocked');
    verbsList.scrollTop = modalOffset;
    verbsList.style.top = 'auto';
    modalOffset = null;
    //document.querySelector('html').addEventListener('click', pageLockController.backgroundClick);
  };

  // wehn pageLock is active, a background click (that isn't within the pageLock) will unlock the page and trigger the closure of any modals/menus
  var backgroundClick = function(ev) {
    //console.log('1111')
    //var $this = $(ev.target);
    //if ($this.is('[data-js-pageLock-el]') || $this.closest('[data-js-pageLock-el]').length > 0) {
    //  return;
    //}
    //pageLockController.unLockPage();
  };

  // CLOSURE

  return {
    lockPage: lockPage,
    unLockPage: unLockPage
  };

}();