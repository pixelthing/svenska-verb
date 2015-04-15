verbsApp.controller('VerbsListController', ['$scope', 'verbsFactory', function($scope, verbsFactory) {

    $scope.verbs = [];
    $scope.verbsCount = 0;

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
            event.element['0'].style[prefix.transform] = 'translate(0,0)';
            return;
        }
        if (deltaX > 0) {
            event.element['0'].style[prefix.transform] = 'translate(' + deltaX + 'px,0)';
        }
    }
    $scope.panEnd = function(event) {
        event.element['0'].style[prefix.transition] = prefix.css + 'transform 200ms';
        event.element['0'].style[prefix.transform] = 'translate(0,0)';
        setTimeout(function() {
            event.element['0'].style[prefix.transition] = 'none';
        },200)
    }

    verbsFactory
        .getVerbs()
        .then(function(verbs) {
            $scope.verbs = verbs;
            $scope.verbsCount = verbs.length;
        });

}]);