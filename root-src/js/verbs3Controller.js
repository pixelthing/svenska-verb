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

    var prefix = (function () {
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
            .then(function(verbs) {
                verbsOriginal = verbs;
                verbsFiltered = verbsFilter(verbsOriginal);
                verbsCount = verbsFiltered.length;
                verbsPrint(verbsFiltered);
            });

        // set up events
        document.querySelectorAll('.js-vFilterGroupOption').forEach(function( button ){
            button.addEventListener('click', filterGroup);
        });
        document.querySelector('.js-vFilterInputIcon').addEventListener('click', searchFocus);
        document.querySelector('.js-vFilterInput').addEventListener('keyup', search);
        document.querySelector('.js-vFilterInputClear').addEventListener('click', searchClear);
    }

    // PRINT

    var verbsPrint = function(verbs) {
        var buffer = '';
        verbs.forEach(function(verb, index){
            buffer += " \
            <article class=\"vRow vGroup" + verb.group + "\" \
                hm-tap=\"detailOpen(" + index + ")\"> \
                <span class=\"vCol vColTrans\" \
                    data-verbForm=\"english\"> \
                        " + verb.trans.en + " \
                    </span> \
                <div class=\"vColWrap\" \
                    data-verbGroup=\"" + verb.group + "\" \
                    hm-panleft=\"panLeft\" \
                    hm-panright=\"panRight\" \
                    hm-panend=\"panEnd\" \
                    hm-manager-options='{\"threshold\":20}' \
                    hm-recognizer-options='[{\"type\":\"pan\",\"directions\":\"DIRECTION_HORIZONTAL\"}]'\
                    data-index=\"" + index + "\" > \
                    <span class=\"vCol vColInfinitiv\">" + verb.infinitiv + "</span> \
                    <span class=\"vCol\">" + verb.presens + "</span> \
                    <span class=\"vCol\">" + verb.preteritum + "</span> \
                    <span class=\"vCol\">" + verb.perfekt + "</span> \
                </div> \
            </article>";
        });
        document.querySelector('.js-vListContainer').innerHTML = buffer;
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
        searchTimeout = setTimeout(function() {
            searchSubmit();
        },100);
    }

    var searchFocus = function() {
        document.querySelector('.js-vFilterInput').focus();
    }

    var searchSubmit = function() {
        scroll(0,0);
        var input = document.querySelector('.js-vFilterInput');
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
        var input = document.querySelector('.js-vFilterInput');
        scroll(0,0);
        // blur the field to clear the keyboard on mobile devices
        input.value = '';
        input.blur();
        // turn off the keyword search
        document.querySelector('.vFilterForm').value = '';
        document.querySelector('.vFilterForm').classList.remove('vFilterFormActive');
        // turn all group filter buttons off
        document.querySelectorAll('.js-vFilterGroupOption').forEach(function( button ){
            button.classList.remove('vFilterGroupOptionActive');
        });
        // reset filters
        filterCurrentGroup = null;
        filterCurrentSearch = null;
        // delay the  filtering of the list a tiny bit to not delay the UI interaction
        setTimeout(function() {
            verbsFiltered = verbsFilter(verbsOriginal,filterCurrentGroup,filterCurrentSearch);
            verbsPrint(verbsFiltered);
        },50);
    }

    var searchLoading = function() {
        return
        scroll(0,0);
    }


    var searchLoaded = function() {}

    var filterGroup = function() {
        scroll(0,0);
        var buttonGroup = this.getAttribute('data-group');

        // turn all group filter buttons off
        document.querySelectorAll('.js-vFilterGroupOption').forEach(function( button ){
            button.classList.remove('vFilterGroupOptionActive');
        });

        document.querySelector('.js-vListContainer').setAttribute('class','js-vListContainer');

        // set the new group (and turn the button on)
        if (filterCurrentGroup !== buttonGroup) {
            document.querySelector('.js-vListContainer').classList.add('vListContainer--group' + buttonGroup);
            filterCurrentGroup = buttonGroup;
            this.classList.add('vFilterGroupOptionActive');
        } else {
            filterCurrentGroup = null;
        }
    }

    var filterClear = function() {
        $scope.search = '';
        $scope.filterCurrentGroupButton = null;
        $scope.filterCurrentGroup = null;
        $scope.filterInputButton = null;
    }

    // DETAIL

    var backgroundClick = function() {
        $rootScope.$broadcast('backgroundClick');
    }

    var detailOpen = function(index) {
        $scope.detailFill(index);
        modalOffset = document.body.scrollTop;
        $timeout(function() {
            $scope.detailIsOpen = true;
            document.querySelector('.vList').style.top = '-' + modalOffset + 'px';
            document.querySelector('html').classList.add('modal');
        });
    }

    var detailClose = function() {
        $scope.detailIsOpen = false;
        $timeout(function() {
            $scope.detailData = {};
            document.querySelector('html').classList.remove('modal');
            document.body.scrollTop = modalOffset;
            document.querySelector('.vList').style.top = 'auto';
            modalOffset = null;
        });
    }


    var detailFill = function(index) {
        $scope.detailData = $scope.verbsFiltered[index];
        $scope.detailData.audio = 'http://translate.google.com/translate_tts?ie=UTF-8&q=' + $scope.detailData.infinitiv 
        + ',' + $scope.detailData.presens 
        + ',' + $scope.detailData.preteritum 
        + ',' + $scope.detailData.perfekt 
        + '&tl=sv-se';
    }

    // TOUCH SLIDE

    var panning = false;

    var panRight = function(event) {
        var deltaX = event.deltaX;
        var deltaY = event.deltaY;
        if (Math.abs(deltaY)/3 > Math.abs(deltaX) || deltaY > 20 ) {
            event.element['0'].style[prefix.transform] = 'translate3d(0,0,0)';
            panning = false;
            return;
        }
        if (deltaX > 0) {
            event.element['0'].style[prefix.transform] = 'translate3d(' + deltaX + 'px,0,0)';
            panning = 'right';
        }
    }
    var panLeft = function(event) {
        var deltaX = event.deltaX;
        var deltaY = event.deltaY;
        if (Math.abs(deltaY)/3 > Math.abs(deltaX) || deltaY > 20 ) {
            event.element['0'].style[prefix.transform] = 'translate3d(0,0,0)';
            panning = false;
            return;
        }
        if (deltaX < 0) {
            event.element['0'].style[prefix.transform] = 'translate3d(' + deltaX + 'px,0,0)';
            panning = 'left';
        }
        var index = event.element['0'].getAttribute('data-index');
        if (deltaX < -100) {
            $scope.detailAudioOpen(index);
            event.element['0'].style[prefix.transform] = 'translate3d(0,0,0)';
            panning = false;
        }
    }
    var panEnd = function(event) {
        event.element['0'].style[prefix.transition] = prefix.css + 'transform 200ms';
        event.element['0'].style[prefix.transform] = 'translate3d(0,0,0)';
        panning = false;
        setTimeout(function() {
            event.element['0'].style[prefix.transition] = 'none';
        },200);
    }

    // CLOSURE

    ready(function(){
        init();
    })

    return {
        searchSubmit: searchSubmit,
        searchClear: searchClear
    }

}();
