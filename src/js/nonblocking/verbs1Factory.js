var verbsFactory = function () {

  "use strict";

  var process = function(array) {
    return array.map(function verbsFactoryProcessMap (verb) {
      verb.presens    = conjugatePresens(verb)   + conjugateReflexive(verb);
      verb.preteritum = conjugatePreteritum(verb)  + conjugateReflexive(verb);
      verb.perfekt    = conjugatePerfekt(verb)   + conjugateReflexive(verb);
      verb.infinitiv  = verb.infinitiv       + conjugateReflexive(verb);
      verb.search     = verb.presens + ' ' + verb.preteritum + ' ' + verb.perfekt + ' ' + verb.infinitiv + ' ' + verb.trans.en;
      return verb;
    });
  };

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
  };

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
  };

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
  };

  var conjugateReflexive = function(verb) {
    return ( verb.reflexive ? ' sig' : '' );
  };

  var getData = function() {

    return new Promise(function verbsFactoryGetDataPromise (resolve, reject) {
      //return the promise directly.
      get('svenska.json').then(function verbsFactoryGetDataPromiseThen (response) {
        //resolve the promise as the data
        var raw = JSON.parse(response).verbs;
        // process the presens/preteritum/perfekt
        var processed = process(raw);
        // return the processed data
        resolve(processed);
      }, function verbsFactoryGetDataPromiseError (error) {
        reject();
        alert('error loading data - sorry!');
      });
    });

  };

  return {
    getData : getData
  };

}();