verbsApp.controller('VerbsListController', ['$scope', 'verbsFactory', function($scope, verbsFactory) {

    $scope.isLoading = true;
    $scope.verbs = [];
    $scope.verbsCount = 0;
    $scope.filterCurrentGroup = null;

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
        },200)
    }

    $scope.searchFocus = function() {
        document.querySelector('.js-vFilterInput').focus();
    }

    $scope.searchSubmit = function() {
        document.querySelector('.js-vFilterFocusTarget').focus();
    }

    $scope.searchClear = function() {
        $scope.search = '';
    }

    $scope.filterGroup = function(group) {
        $scope.filterCurrentGroup = ( $scope.filterCurrentGroup === group ? null : group );
    }

    $scope.filterClear = function() {
        $scope.search = '';
        $scope.filterCurrentGroup = null;
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

    verbsFactory
        .getVerbs()
        .then(function(verbs) {
            $scope.verbs = verbs;
            $scope.verbsCount = verbs.length;
            $scope.isLoading = false;
        });

}]);