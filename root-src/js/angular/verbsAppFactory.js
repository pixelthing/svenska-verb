verbsApp.factory('verbsFactory', ['$http', function verbsFactory($http) {

    var conjugate = function(array) {
        return array;
    }

    var getData = function() {

        //return the promise directly.
        return $http.get('svenska.json')
            .then(function(result) {
                //resolve the promise as the data
                var raw = result.data.data.verbs;
                // process the presens/preteritum/perfekt
                var processed = conjugate(raw);
                // return the processed data
                return processed;
            }, function() {
                alert('error loading data - sorry!');
            });
    }

    return {
        getVerbs : getData
    };

}]);