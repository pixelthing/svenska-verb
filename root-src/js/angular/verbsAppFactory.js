verbsApp.factory('verbsFactory', ['$http', function verbsFactory($http) {

    var conjugate = function(array) {
        return array.map(function(verb) {
            verb.presens     = conjugatePresens(verb)     + conjugateReflexive(verb);
            verb.preteritum  = conjugatePreteritum(verb)  + conjugateReflexive(verb);
            verb.perfekt     = conjugatePerfekt(verb)     + conjugateReflexive(verb);
            verb.infinitiv   = verb.infinitiv             + conjugateReflexive(verb);
            return verb;
        });
    }

    var conjugatePresens = function(verb) {
        if (!verb.presens) {
            switch (verb.group.toString()) {
                case '1': 
                case '3': 
                    verb.presens = verb.infinitiv + 'r';
                    break;
                case '2a': 
                case '2b': 
                    verb.presens = verb.infinitiv.substr(0,verb.infinitiv.length - 1) + 'er';
                    break;
            }
        }
        return verb.presens;
    }

    var conjugatePreteritum = function(verb) {
        if (!verb.preteritum) {
            switch (verb.group.toString()) {
                case '1': 
                    verb.preteritum = verb.infinitiv + 'de';
                    break;
                case '2a': 
                    verb.preteritum = verb.infinitiv.substr(0,verb.infinitiv.length - 1) + 'de';
                    break;
                case '2b': 
                    verb.preteritum = verb.infinitiv.substr(0,verb.infinitiv.length - 1) + 'te';
                    break;
                case '3': 
                    verb.preteritum = verb.infinitiv + 'dde';
                    break;
            }
        }
        return verb.preteritum;
    }

    var conjugatePerfekt = function(verb) {
        if (!verb.perfekt) {
            switch (verb.group.toString()) {
                case '1': 
                    verb.perfekt = verb.infinitiv + 't';
                    break;
                case '2a': 
                case '2b': 
                    verb.perfekt = verb.infinitiv.substr(0,verb.infinitiv.length - 1) + 't';
                    break;
                case '3': 
                    verb.perfekt = verb.infinitiv + 'tt';
                    break;
            }
        }
        return verb.perfekt;
    }

    var conjugateReflexive = function(verb) {
        return ( verb.reflexive ? ' sig' : '' );
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