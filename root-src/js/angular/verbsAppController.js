verbsApp.controller('verbsListController', function($scope, verbsFactory) {

    $scope.verbs = [{
        'en' : 'bob'
    }];
    $scope.verbsCount = 0;

    verbsFactory.getVerbs()
        .then(function(verbs) {
            $scope.verbs = verbs;
            $scope.verbsCount = verbs.length;
        });

});