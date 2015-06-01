verbsApp.filter('VerbsFilter', ['$filter', function ($filter) {
  return function (items,group,keyword) {
    var filtered = [];
    var wordMatch = new RegExp(keyword, 'i');
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (group && !keyword) {
        if (item.group === group) {
          filtered.push(item);
        }
      } else if (!group && keyword) {
        if (wordMatch.test(item.infinitiv)) {
          filtered.push(item);
        }
      } else if (group && keyword) {
        if (item.group === group && wordMatch.test(item.infinitiv)) {
          filtered.push(item);
        }
      } else {
        filtered.push(item);
      }
    }
    var ordered = $filter('orderBy')(filtered, 'infinitiv');
    var unique = uniq_fast(ordered);
    return unique;
  };

  function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item.infinitiv] !== 1) {
               seen[item.infinitiv] = 1;
               out[j++] = item;
         }
    }
    return out;
}

}]);