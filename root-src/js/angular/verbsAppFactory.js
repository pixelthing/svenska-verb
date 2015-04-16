verbsApp.factory('verbsFactory', ['$http', function verbsFactory($http) {

    var getData = function() {

        //return the promise directly.
        return $http.get('svenska.json')
            .then(function(result) {
                //resolve the promise as the data
                return result.data.data.verbs;
            }, function() {
                alert('error loading data - sorry!');
            });
    }

    return {
        getVerbs : getData
    };

}]);