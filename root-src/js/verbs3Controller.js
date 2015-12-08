var verbsController = function () {

    var isLoading = true;
    var verbsOriginal = [];
    var verbsFiltered = [];
    var verbsCount = 0;
    var verbsFiltered = [];
    var filterCurrentGroup = null;
    var filterCurrentSearch = null;
    var filterCurrentGroupButton = null;
    var filterInputButton = false;
    var detailIsOpen = false;
    var detailData = {};
    var modalOffset = null;

    // PREFIX HELPER

    var prefix = (function verbsPrefixHelper () {
        var styles = window.getComputedStyle(document.documentElement, ''),
            pre = (Array.prototype.slice
                .call(styles)
                .join('') 
                .match(/-(moz|webkit|ms)-/)
            )[1] || '',
            dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];


        var jsPrefix = pre[0].toUpperCase() + pre.substr(1);
        var transformPrefixed = 'tranform';
        var transitionPrefixed = 'transition';
        if (dom.length) {
            transformPrefixed = pre + 'Transform';
            transitionPrefixed = pre + 'Transition';
        }
        return {
            dom: dom,
            lowercase: pre,
            css: '-' + pre + '-',
            js: jsPrefix,
            transform: transformPrefixed,
            transition: transitionPrefixed
        };
    })();

    // INIT

    var init = function() {

        // pull in data 
        verbsFactory
            .getData()
            .then(function verbInitThen (verbs) {
                verbsOriginal = verbs;
                verbsFiltered = verbsFilter(verbsOriginal);
                verbsCount = verbsFiltered.length;
                verbsPrint(verbsFiltered);
            });

        // set up events
        document.querySelectorAll('[data-js-filter-group-option]').forEach(function verbInitButtonClick( button ){
            button.addEventListener('click', filterGroup);
        });
        document.querySelector('[data-js-filter-icon]').addEventListener('click', searchFocus);
        document.querySelector('[data-js-filter-input]').addEventListener('keyup', search);
        document.querySelector('[data-js-filter-clear]').addEventListener('click', searchClear);
        document.querySelector('[data-js-target]').addEventListener('click', detailOpen);
        document.querySelector('[data-js-detail-close]').addEventListener('click', detailClose);
        document.querySelector('[data-js-empty-click]').addEventListener('click', searchClear);
    }

    // PRINT

    var verbsPrint = function(verbs) {
        var buffer = '';
        document.querySelector('[data-js-empty]').classList.remove('vListEmpty--active');
        verbs.forEach(function verbsPrintEach(verb, index){
            buffer += " \
            <article class=\"vRow vGroup" + verb.group + "\"> \
                <span class=\"vCol vColTrans\" \
                    data-verbForm=\"english\"> \
                    " + verb.trans.en + " \
                </span> \
                <div class=\"vColWrap js-vColWrap\" \
                    data-verbGroup=\"" + verb.group + "\" \
                    data-index=\"" + index + "\" > \
                    <span class=\"vCol vColInfinitiv\">" + verb.infinitiv + "</span> \
                    <span class=\"vCol\">" + verb.presens + "</span> \
                    <span class=\"vCol\">" + verb.preteritum + "</span> \
                    <span class=\"vCol\">" + verb.perfekt + "</span> \
                </div> \
            </article>";
        });
        document.querySelector('[data-js-target]').innerHTML = buffer;
        // empty?
        if (!verbs.length) {
            onAnimationFrame(function verbsPrintAnimationFrame () {
                document.querySelector('[data-js-empty]').classList.add('vListEmpty--active');
            });
        }
    }

    // SEARCH/FILTER

    //$scope.$watch('search', function() {
    //    $scope.verbsFiltered = $filter('VerbsFilter')($scope.verbs, $scope.filterCurrentGroup, $scope.search);
    //});

    var searchTimeout = null;
    var search = function() {
    
        if (searchTimeout !== null) {
            clearTimeout(searchTimeout);
        }
        searchTimeout = setTimeout(function searchTimeout() {
            searchSubmit();
        },100);
    }

    var searchFocus = function() {
        document.querySelector('[data-js-filter-input]').focus();
    }

    var searchSubmit = function() {
        scroll(0,0);
        var input = document.querySelector('[data-js-filter-input]');
        var inputKeyword = input.value;

        // set the new search keyword (and turn the input on)
        if (filterCurrentSearch === inputKeyword) {
            return;
        } else if (!inputKeyword) {
            input.blur();
            filterCurrentSearch = null;
            document.querySelector('.vFilterForm').classList.remove('vFilterFormActive');
        } else if (inputKeyword.length < 2) {
            filterCurrentSearch = null;
            document.querySelector('.vFilterForm').classList.remove('vFilterFormActive');
        } else {
            filterCurrentSearch = inputKeyword;
            document.querySelector('.vFilterForm').classList.add('vFilterFormActive');
        }

        verbsFiltered = verbsFilter(verbsOriginal,filterCurrentSearch);
        verbsPrint(verbsFiltered);
        searchTimeout = null;
    }

    var searchClear = function() {
        var input = document.querySelector('[data-js-filter-input]');
        scroll(0,0);
        // blur the field to clear the keyboard on mobile devices
        input.value = '';
        input.blur();
        // turn off the keyword search
        document.querySelector('.vFilterForm').value = '';
        document.querySelector('.vFilterForm').classList.remove('vFilterFormActive');
        // turn all group filter buttons off
        document.querySelectorAll('[data-js-filter-group-option]').forEach(function( button ){
            button.classList.remove('vFilterGroupOptionActive');
        });
        // reset filters
        filterCurrentGroup = null;
        filterCurrentSearch = null;
        // delay the  filtering of the list a tiny bit to not delay the UI interaction
        onAnimationFrame(function searchClearAnimationFrame () {
            verbsFiltered = verbsFilter(verbsOriginal,filterCurrentGroup,filterCurrentSearch);
            verbsPrint(verbsFiltered);
            document.querySelector('[data-js-empty]').classList.remove('vListEmpty--active');
        });
    }

    var searchLoading = function() {
        return
        scroll(0,0);
    }


    var searchLoaded = function() {}

    var filterGroup = function() {
        scroll(0,0);
        var buttonGroup = this.getAttribute('data-group');
        document.querySelector('[data-js-empty]').classList.remove('vListEmpty--active');

        // turn all group filter buttons off
        document.querySelectorAll('[data-js-filter-group-option]').forEach(function filterGroupEach( button ){
            button.classList.remove('vFilterGroupOptionActive');
        });

        // clear the overall control CSS
        document.querySelector('[data-js-target]').setAttribute('class','');

        // set the new group (and turn the button on)
        if (filterCurrentGroup !== buttonGroup) {
            document.querySelector('[data-js-target]').classList.add('vListContainer--group' + buttonGroup);
            filterCurrentGroup = buttonGroup;
            this.classList.add('vFilterGroupOptionActive');
        } else {
            filterCurrentGroup = null;
        }
        // empty?
        var verbsFiltered = document.querySelectorAll('[data-verbgroup="' + buttonGroup + '"]');
        if (!verbsFiltered.length) {
            onAnimationFrame(function verbsPrintAnimationFrame () {
                document.querySelector('[data-js-empty]').classList.add('vListEmpty--active');
            });
        }
    }

    var filterClear = function(ev) {
        ev.preventDefault();
        $scope.search = '';
        $scope.filterCurrentGroupButton = null;
        $scope.filterCurrentGroup = null;
        $scope.filterInputButton = null;
    }

    // DETAIL

    var detailOpen = function(ev) {
        ev.preventDefault();
        // if the event has a target
        if(ev.target) {
            // if the target is part of a row
            var wrap = getClosest(ev.target,'.js-vColWrap');
            if (wrap) {
                var index = wrap.getAttribute('data-index');
                detailFill(index);
                document.querySelector('[data-js-verbs]').classList.add('vContainer--active');
                pageLockController.lockPage();
            }

        }
    }

    var detailClose = function(ev) {
        ev.preventDefault();
        document.querySelector('[data-js-verbs]').classList.remove('vContainer--active');
        pageLockController.unLockPage();
    }


    var detailFill = function(index) {
        index = parseInt(index);
        var verbData = verbsFiltered[index];
        document.querySelectorAll('[data-js-detail-infinitiv]').map(function detailFillMap1(obj) {obj.innerHTML = verbData.infinitiv;});
        document.querySelectorAll('[data-js-detail-translation]').map(function detailFillMap2(obj) {obj.innerHTML = verbData.trans['en'];});
        document.querySelectorAll('[data-js-detail-presens]').map(function detailFillMap3(obj) {obj.innerHTML = verbData.presens;});
        document.querySelectorAll('[data-js-detail-preterium]').map(function detailFillMap4(obj) {obj.innerHTML = verbData.preteritum;});
        document.querySelectorAll('[data-js-detail-perfekt]').map(function detailFillMap5(obj) {obj.innerHTML = verbData.perfekt;});
        document.querySelector('[data-js-detail-title-group]').setAttribute('class','vDetailTitleGrp');
        document.querySelector('[data-js-detail-title-group]').classList.add('vDetailTitleGrp' + verbData.group);
        document.querySelector('[data-js-detail-title-group]').innerHTML = verbData.group;
    }

    // TOUCH SLIDE

 //   var panning = false;
//
 //   var hammertime = new Hammer(document.querySelector('.vRow'));
 //   hammertime.on('panright', panRight);
//
 //   var panRight = function(event) {
 //       var deltaX = event.deltaX;
 //       var deltaY = event.deltaY;
 //       if (Math.abs(deltaY)/3 > Math.abs(deltaX) || deltaY > 20 ) {
 //           event.element['0'].style[prefix.transform] = 'translate3d(0,0,0)';
 //           panning = false;
 //           return;
 //       }
 //       if (deltaX > 0) {
 //           event.element['0'].style[prefix.transform] = 'translate3d(' + deltaX + 'px,0,0)';
 //           panning = 'right';
 //       }
 //   }
 //   var panLeft = function(event) {
 //       var deltaX = event.deltaX;
 //       var deltaY = event.deltaY;
 //       if (Math.abs(deltaY)/3 > Math.abs(deltaX) || deltaY > 20 ) {
 //           event.element['0'].style[prefix.transform] = 'translate3d(0,0,0)';
 //           panning = false;
 //           return;
 //       }
 //       if (deltaX < 0) {
 //           event.element['0'].style[prefix.transform] = 'translate3d(' + deltaX + 'px,0,0)';
 //           panning = 'left';
 //       }
 //       var index = event.element['0'].getAttribute('data-index');
 //       if (deltaX < -100) {
 //           $scope.detailAudioOpen(index);
 //           event.element['0'].style[prefix.transform] = 'translate3d(0,0,0)';
 //           panning = false;
 //       }
 //   }
 //   var panEnd = function(event) {
 //       event.element['0'].style[prefix.transition] = prefix.css + 'transform 200ms';
 //       event.element['0'].style[prefix.transform] = 'translate3d(0,0,0)';
 //       panning = false;
 //       setTimeout(function() {
 //           event.element['0'].style[prefix.transition] = 'none';
 //       },200);
 //   }

    // CLOSURE

    ready(function verbReady(){
        init();
    })

    return {
        searchSubmit: searchSubmit,
        searchClear: searchClear
    }

}();
