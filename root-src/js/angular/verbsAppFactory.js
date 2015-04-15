verbsApp.factory('verbsFactory', ['$http', function verbsFactory($http) {

    var verbs = [];
    var state = {
        'isLoading': false,
        'filterGroup': false
    };

    var getData = function() {

        //return the promise directly.
        state.isLoading = true;
        return $http.get('svenska.json')
            .then(function(result) {
                //resolve the promise as the data
                state.isLoading = false;
                return result.data.data.verbs;
            }, function() {
                state.isLoading = false;
                alert('error loading data - sorry!');
            });
    }

    return {
        getState : function() {
            return state;
        },
        getVerbs : getData
    };

}]);