verbsApp.controller('VerbsListController', ['$scope', 'verbsFactory', function($scope, verbsFactory) {

    $scope.verbs = [];
    $scope.verbsCount = 0;

    $scope.panRight = function(event) {
        var deltaX = event.deltaX;
        if (deltaX > 0) {
            event.element.context.style.transform = 'translate(' + deltaX + 'px,0)';
        }
    }
    $scope.panEnd = function(event) {
        event.element.context.style.transition = 'transform 200ms';
        event.element.context.style.transform = 'translate(0,0)';
        setTimeout(function() {
            event.element.context.style.transition = 'none';
        },200)
    }

    verbsFactory
        .getVerbs()
        .then(function(verbs) {
            $scope.verbs = verbs;
            $scope.verbsCount = verbs.length;
        });

}]);