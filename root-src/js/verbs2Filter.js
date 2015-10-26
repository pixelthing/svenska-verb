var verbsFilter = function () {

  return function (items,keyword) {
    var filtered = [];
    if (keyword && keyword.length < 2) {
      keyword = false;
    }
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (keyword) {
        if (item.search.indexOf(keyword) >= 0) {
          filtered.push(item);
        }
      } else {
        filtered.push(item);
      }
    }
    var ordered = verbsSort(filtered);
    var unique = verbsUnique(ordered);
    return unique;
  };

  function verbsSort (array) {
      function compare(a, b) {
          if (a.infinitiv < b.infinitiv)
              return -1;
          if (a.infinitiv > b.infinitiv)
              return 1;
          return 0;
      }
      return array.sort(compare);
  }

  function verbsUnique(a) {
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

}();