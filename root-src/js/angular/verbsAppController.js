verbsApp.controller('VerbsListController', ['$scope', 'verbsFactory', function($scope, verbsFactory) {

    $scope.verbs = [];
    $scope.verbsCount = 0;

    verbsFactory.getVerbs()
        .then(function(verbs) {
            $scope.verbs = verbs;
            $scope.verbsCount = verbs.length;
        });

}]);