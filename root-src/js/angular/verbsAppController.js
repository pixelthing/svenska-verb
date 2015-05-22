verbsApp.controller('VerbsListController', ['$rootScope', '$scope', '$timeout', 'verbsFactory', function($rootScope, $scope, $timeout, verbsFactory) {

    $scope.isLoading = true;
    $scope.verbs = [];
    $scope.verbsCount = 0;
    $scope.verbsFiltered = [];
    $scope.filterCurrentGroup = null;
    $scope.filterCurrentGroupButton = null;
    $scope.filterInputButton = false;
    $scope.detailIsOpen = false;
    $scope.detailData = {};

    // PREFIX HELPER

    var prefix = (function () {
        var styles = window.getComputedStyle(document.documentElement, ''),
            pre = (Array.prototype.slice
                .call(styles)
                .join('') 
                .match(/-(moz|webkit|ms)-/)
            )[1] || '',
            dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];


        var jsPrefix = pre[0].toUpperCase() + pre.substr(1);
        var transformPrefixed = 'tranform';
        var transitionPrefixed = 'transition';
        if (dom.length) {
            transformPrefixed = pre + 'Transform';
            transitionPrefixed = pre + 'Transition';
        }
        return {
            dom: dom,
            lowercase: pre,
            css: '-' + pre + '-',
            js: jsPrefix,
            transform: transformPrefixed,
            transition: transitionPrefixed
        };
    })();

    // TOUCH SLIDE

    $scope.panRight = function(event) {
        var deltaX = event.deltaX;
        var deltaY = event.deltaY;
        if (Math.abs(deltaY)/3 > Math.abs(deltaX) || deltaY > 20 ) {
            event.element['0'].style[prefix.transform] = 'translate3d(0,0,0)';
            return;
        }
        if (deltaX > 0) {
            event.element['0'].style[prefix.transform] = 'translate3d(' + deltaX + 'px,0,0)';
        }
    }
    $scope.panEnd = function(event) {
        event.element['0'].style[prefix.transition] = prefix.css + 'transform 200ms';
        event.element['0'].style[prefix.transform] = 'translate3d(0,0,0)';
        setTimeout(function() {
            event.element['0'].style[prefix.transition] = 'none';
        },200);
    }

    // SEARCH/FILTER

    $scope.searchFocus = function() {
        document.querySelector('.js-vFilterInput').focus();
    }

    $scope.searchSubmit = function() {
        document.querySelector('.js-vFilterFocusTarget').focus();
    }

    $scope.searchClear = function() {
        $scope.filterInputButton = false;
        $scope.isLoading = true;
        $timeout(function() {
            $scope.isLoading = false;
            $scope.search = '';
        },200);
    }

    $scope.searchLoading = function() {
        $timeout(function() {
            if ($scope.search && $scope.search.length) {
                $scope.filterInputButton = true;
                return;
            }
            $scope.filterInputButton = false;
            scroll(0,0);
        },301); // needs to match the debounce value
    }

    $scope.filterGroup = function(group) {
        scroll(0,0);
        $scope.isLoading = true;
        $scope.filterCurrentGroupButton = ( $scope.filterCurrentGroup === group ? null : group );
        $timeout(function() {
            $scope.filterCurrentGroup = $scope.filterCurrentGroupButton;
            $scope.isLoading = false;
        },200);
    }

    $scope.filterClear = function() {
        $scope.search = '';
        $scope.filterCurrentGroupButton = null;
        $scope.filterCurrentGroup = null;
        $scope.filterInputButton = null;
    }

    $scope.filterGroupFilter = function(value, index) {
        if ($scope.filterCurrentGroup != null) {
            if ('' + value.group === '' + $scope.filterCurrentGroup) {
                return value;
            }
        } else {
            return value;
        }
    }

    // DETAIL

    $scope.backgroundClick = function() {
        $rootScope.$broadcast('backgroundClick');
    }

    $scope.detailOpen = function(index) {
        document.querySelector('html').classList.add('modal');
        $scope.detailIsOpen = true;
        $scope.detailFill(index);
    }

    $scope.detailClose = function() {
        document.querySelector('html').classList.remove('modal');
        $scope.detailData = {};
        $scope.detailIsOpen = false;
    }


    $scope.detailFill = function(index) {
        $scope.detailData = $scope.verbsFiltered[index];
        $scope.detailData.audio = 'http://translate.google.com/translate_tts?ie=UTF-8&q=' + $scope.detailData.infinitiv 
        + ',' + $scope.detailData.presens 
        + ',' + $scope.detailData.preteritum 
        + ',' + $scope.detailData.perfekt 
        + '&tl=sv-se';
    }

    $rootScope.$on('backgroundClick', function () {
        $scope.detailClose();
    });

    // AUDIO

    $scope.detailAudioOpen = function(index) {
        document.querySelector('html').classList.add('modal');
        $scope.detailFill(index);
        $scope.audioIsOpen = true;
    }

    $scope.detailAudioClose = function() {
        document.querySelector('html').classList.remove('modal');
        $scope.detailData = {};
        $scope.audioIsOpen = false;
    }

    verbsFactory
        .getVerbs()
        .then(function(verbs) {
            $scope.verbs = verbs;
            $scope.verbsCount = verbs.length;
            $scope.isLoading = false;
        });

}]);