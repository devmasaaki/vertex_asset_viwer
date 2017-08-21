'use strict';


/**
 * @ngdoc overview
 * @name posterAppApp
 * @description
 * # posterAppApp
 *
 * Main module of the application.
 */

var jQuery;
var cosmic;
var yao = new Yao.YaoApi();

var posterApp = angular
    .module('posterAppApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'LocalStorageModule',
        'ng-slide-down',
        'vAccordion'
    ])
    .config(function($routeProvider, $locationProvider, localStorageServiceProvider) {

        localStorageServiceProvider.setPrefix('VertexUK.DMR.');
        localStorageServiceProvider.setStorageType('localStorage');

        $routeProvider.when('/landing', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
        });
        $routeProvider.when('/category', {
            templateUrl: 'views/category.html',
            controller: 'CategoryCtrl',
            controllerAs: 'category'
        });
        $routeProvider.when('/content:name', {
            templateUrl: 'views/content.html',
            controller: 'ContentCtrl',
            controllerAs: 'content'
        });
        //   $routeProvider.when('/all/search:id', {
        //     templateUrl: 'views/main.html',
        //     controller: 'MainCtrl',
        //     controllerAs: 'main'
        //   });
        //    $routeProvider.when('/all/select:id', {
        //     templateUrl: 'views/main.html',
        //     controller: 'MainCtrl',
        //     controllerAs: 'main'
        //   });
        //   $routeProvider.when('/favourites', {
        //     templateUrl: 'views/favourites.html',
        //     controller: 'FavouriteCtrl',
        //     controllerAs: 'favourite'
        //   });
        //   $routeProvider.when('/favourites/search:id', {
        //     templateUrl: 'views/favourites.html',
        //     controller: 'FavouriteCtrl',
        //     controllerAs: 'favourite'
        //   });
        $routeProvider.otherwise({
            redirectTo: '/landing'
        });
        $locationProvider.hashPrefix('');
    })
    .directive('emitTarget', function() {
        return {
            link: function(scope, element, attrs) {
                scope.$watch('__height', function(newHeight, oldHeight) {
                    // console.log('Height Changed!!!!!!!!!!!!!!!!!!!!!!!!');
                    scope.resize();
                    // elem.attr( 'style', 'margin-top: ' + (58 + newHeight) + 'px' );
                });
            }
        };
    }).directive('emitSource', function() {
        return {
            link: function(scope, element, attrs) {
                // console.log('Height change!!!!!!');
                // console.log(scope);
                // console.log(element);
                // console.log(attrs);
                scope.$watch(function() {
                    scope.__height = element.height();
                });
            }
        };
    }).directive('emitSearch', function() {
        return {
            link: function(scope, element, attrs) {
                scope.$watch('$routeParams.search', function(value) {
                    console.log('Search value change ' + value);
                    // scope.resize();
                    // elem.attr( 'style', 'margin-top: ' + (58 + newHeight) + 'px' );
                });
            }
        };
    }).run(function($rootScope, $http, $window, $location, $routeParams, localStorageService, $route) { // ,  $location ) {

        $rootScope.data = {
            categories: [],
            content: [],
            structure: null,
            favourites: [],
        };

        $rootScope.dom = {
            headerHeight: 0,
            pageHeight: 0,
            lastPageHeight: 0,
        };

        $rootScope.fields = {
            searchValue: null,
            favourites: false,
            loading: true,
        };

        $rootScope.location = {
            lastLocation: '',
            newLocation: $location.absUrl(),
            pageName: '',
            pageSlug: '',
        };

        $rootScope.cosmic = {
            config: {
                bucket: {
                    slug: null,
                    read_key: null,
                    write_key: null,
                }
            },
            data: null,
        };

        $rootScope.yao = {
            data: null,
            filterdItems: null
        }

        $rootScope.posters = [];
        // $rootScope.data.favourites = [];
        // $rootScope.fields.localStorageKey = 'data';

        $rootScope.fields = {
            version: 1.0,
            searchValue: null,
            appType: 'Blank',
            localStorageData: [],
            localStorageKey: 'data',
            loading: true,
            refresh: false,
        };

        $rootScope.appLoad = function() {
            $rootScope.fields.favourites = false;
        };

        $rootScope.$on('$locationChangeSuccess', function(event, newURL, oldURL) {
            $rootScope.location.newLocation = newURL;
            $rootScope.location.lastLocation = oldURL;

            // console.log(oldURL);
            // console.log(newURL);

            var oldIndex = $rootScope.location.lastLocation.indexOf('?search=');
            var newIndex = $rootScope.location.newLocation.indexOf('?search=');
            if (oldIndex !== -1 || newIndex !== -1) {
                $rootScope.resize();
            }

        });


        $rootScope.toggleSearch = function() {
            console.log('$rootScope.toggleSearch()');
            $location.search('search', $rootScope.fields.searchValue);

            console.log($routeParams);

        };


        $rootScope.getCategoryData = function(name) {
            var result = null;
            for (var i = 0; i < $rootScope.data.categories.length; i++) {
                var category = $rootScope.data.categories[i];
                if (name === category.metafield.name.value) {
                    result = category;
                }
            }
            return result;
        };



        $rootScope.SetLocalStorage = function() {
            var data = localStorageService.set($rootScope.fields.localStorageKey, $rootScope.data.favourites);
            // $window.console.log(data);
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    console.log(item);
                }
            }
        };
        $rootScope.GetLocalStorage = function() {
            $window.console.log('GetLocalStorage();');
            $rootScope.data.favourites = localStorageService.get($rootScope.fields.localStorageKey);
            // $window.console.log($rootScope.data.favourites);
            // $rootScope.data.favourites = data;
            if ($rootScope.data.favourites && $rootScope.data.favourites.length > 0) {
                for (var i = 0; i < $rootScope.data.favourites.length; i++) {
                    var item = $rootScope.data.favourites[i];
                    console.log(item);
                }

            } else {
                $rootScope.data.favourites = [];
                // for( var a = 0; a < $rootScope.posters.length; a++ ) {
                //   var poster = $rootScope.posters[a];
                //   // console.log(poster);
                //   // $rootScope.data.favourites.push( poster.slug );
                // }
                $rootScope.SetLocalStorage();
            }
            $rootScope.safeApply();
        };

        $rootScope.getFavourite = function(slug) {
            var index = $rootScope.data.favourites.indexOf(slug);
            // console.log($scope.favorites);
            if (index > -1) {
                return true;
            } else {
                return false;
            }
        };
        // $rootScope.setFavourite = function(slug ) {
        //   $window.console.log('Favourite ' + slug);
        //   // debugger;
        //   if( $rootScope.data.favourites ) {
        //     var index = $rootScope.data.favourites.indexOf(slug);
        //     if (index > -1) {
        //       // Splice
        //       $rootScope.data.favourites.splice(index, 1);
        //       if( $rootScope.interact.profile !== null ) {
        //         $rootScope.cosmic.addAnalyticObject("user-" + $rootScope.interact.profile.uId + "." + "asset-rosters" + "." + "favourite-off:" + slug);
        //       }
        //     }
        //     else {
        //       $rootScope.data.favourites.push(slug);
        //       if( $rootScope.interact.profile !== null ) {
        //         $rootScope.cosmic.addAnalyticObject("user-" + $rootScope.interact.profile.uId + "." + "asset-rosters" + "." + "favourite-on:" + slug);
        //       }
        //     }
        //     $rootScope.SetLocalStorage();
        //   }
        //   return false;
        // };

        $rootScope.checkLocation = function(keyword) {
            var result = false;
            // var value = keyword.toString().toLowerCase();
            var strIndex = $location.path().indexOf(keyword);
            // console.log($location.path() + ' ' + keyword);
            if (strIndex !== -1) {
                result = true;
                // $window.console.log(strIndex);
                // var sliced = $location.path().slice(0,strIndex);
                // $window.console.log(sliced);
                // $location.url(sliced);
            }
            return result;
        };
        $rootScope.getQuery = function(id) {
            var result = false;
            if (id === 'search') {
                console.log($routeParams);
                var hasThisQuery = $routeParams.hasOwnProperty(id);
                if (hasThisQuery) {
                    // if( $routeParams && $routeParams.search ) {
                    result = true;
                }
            } else if ($rootScope.location.newLocation) {
                // console.log($rootScope.location.newLocation);
                var queryIndex = $rootScope.location.newLocation.indexOf('?' + id);
                if (id === 'search') {
                    // console.log('getQuery('+ id );
                }
                if (queryIndex !== -1) {

                    result = true;
                }
            }
            return result;
        };
        $rootScope.removeQuery = function(query) {
            // console.log('LoadQuery(): ' + query);
            var final = '';
            if (query === 'search') {
                var params = $routeParams;
                // console.log(params);
                var hasThisQuery = params.hasOwnProperty(query);
                if (hasThisQuery) {
                    // turn off query
                    delete params[query];
                    if (query === 'favourites') {
                        // $rootScope.fields.favourites = false;
                    }
                }
            } else if ($rootScope.location.newLocation !== '' && $rootScope.location.newLocation !== null && $rootScope.location.newLocation !== undefined) {
                final += $rootScope.location.newLocation;
                // var queryIndex = final.indexOf('?'+query); // only look for current query
                var queryIndex = final.indexOf('?'); // look for all queries
                if (queryIndex !== -1) {
                    final = final.slice(0, queryIndex);
                }
                // final += $rootScope.getQuery(query) ? '' : '?'+query;
                // console.log(final);
            } else {
                final = '';
            }
            return final;
        };
        $rootScope.addQuery = function(query) {
            // console.log('LoadQuery(): ' + query);
            var final = '';
            if ($rootScope.location.newLocation !== '' && $rootScope.location.newLocation !== null && $rootScope.location.newLocation !== undefined) {
                final += $rootScope.location.newLocation;
                // var queryIndex = final.indexOf('?'+query); // only look for current query
                var queryIndex = final.indexOf('?'); // look for all queries
                if (queryIndex !== -1) {
                    final = final.slice(0, queryIndex);
                }
                final += '?' + query;
                // console.log(final);
            } else {
                final = '';
            }
            return final;

            // {{fields.windowLocation + (getQuery('filters') ? '' : '?filters' ) }}
        };
        $rootScope.searchcat = false;

        $rootScope.resetsearch = function() {
            $rootScope.searchcat = false;
            $rootScope.fields.searchValue = null;
        }

        $rootScope.loadQuery = function(query, value) {
            if (query == 'search') {
                if ($rootScope.searchcat == true) {
                    $rootScope.searchcat = false;
                } else {
                    $rootScope.searchcat = true;
                }
            }

            // console.log('LoadQuery(): ' + query);
            // console.log('---------------');
            var final = '';
            // console.log($rootScope.fields.favourites);


            // $rootScope.fields.favourites === value ? true : false;

            if ($rootScope.location.newLocation !== '' && $rootScope.location.newLocation !== null && $rootScope.location.newLocation !== undefined) {
                final += $rootScope.location.newLocation;
                var params = $routeParams;
                // console.log(params);
                var hasThisQuery = params.hasOwnProperty(query);
                if (hasThisQuery) {
                    // turn off query
                    delete params[query];
                    if (query === 'favourites') {
                        $rootScope.fields.favourites = false;
                    }
                } else {
                    // turn on query
                    params[query] = value;
                    if (query === 'favourites') {
                        $rootScope.fields.favourites = true;
                    }
                }
                // console.log(params);
                // recreate query string
                var queryString = '?';
                var index = 0;
                for (var key in params) {
                    if (params.hasOwnProperty(key)) {
                        if (key !== 'name') {
                            if (index > 0) {
                                queryString += '&';
                            }
                            // console.log(key+'='+params[key]);
                            queryString += key + '=' + params[key];
                            index += 1;
                        }
                    }
                }
                console.log(queryString);
                console.log($rootScope.location.newLocation);
                var questionMarkIndex = $rootScope.location.newLocation.indexOf('?');
                if (questionMarkIndex !== -1) {
                    final = $rootScope.location.newLocation.slice(0, questionMarkIndex);
                } else {
                    final = $rootScope.location.newLocation;
                }
                final += queryString;

                // var queryIndex = final.indexOf('?'+query); // only look for current query
                // var queryIndex = final.indexOf('?'); // look for all queries
                // if( queryIndex !== -1 ) {
                //   final = final.slice(0,queryIndex);
                // }
                // final += $rootScope.getQuery(query) ? '' : '?'+query;
                // console.log(final);
            }
            // else {
            //   final = '';
            // }
            $window.location.href = final;
            $rootScope.resize();
            // return final;
        };

        $rootScope.resize = function() {
            $window.console.log('resize');
            $rootScope.dom.lastPageHeight = $rootScope.dom.pageHeight;

            var headerElements = document.getElementsByClassName('header-ele');
            // console.log(headerElements);

            var footerElements = angular.element(document.getElementsByClassName('footer-ele'));
            // console.log(footerElements);

            var headerSearch = angular.element(document.getElementsByClassName('header-search'))[0];


            var headerObj = angular.element(document.getElementById('header'))[0];
            var headerMainObj = angular.element(document.getElementById('header-main'))[0];
            var headerNavObj = angular.element(document.getElementById('header-nav'))[0];
            var headerSearchObj = angular.element(document.getElementById('header-search'))[0];
            // var overflowObj = angular.element(document.getElementById('overflow'))[0];
            var windowHeight = $window.innerHeight;

            var headerHeight = 0;
            var footerHeight = 0;

            for (var h = 0; h < headerElements.length; h++) {
                var element = angular.element(headerElements[h]);

                // console.log(element.hasClass('ng-hide'));
                // console.log(angular.element(headerElements[i].hasClass('ng-hide')));
                // console.log(headerElements[i].offsetHeight);
                headerHeight += headerElements[h].offsetHeight;
            }
            for (var f = 0; f < footerElements.length; f++) {
                // console.log(footerElements[i].offsetHeight);
                footerHeight += footerElements[f].offsetHeight;
            }

            // if( $rootScope.getQuery('search') )  {
            //   // console.log(headerSearch.offsetHeight);
            //   headerHeight += headerSearch.offsetHeight;
            //   headerHeight += 40;
            // }
            // else {
            if ($rootScope.searchcat == true) {
                headerHeight += 40;
            } else {
                headerHeight += 10;
            }
            // }
            //
            // if( headerHeight === 0 ) {
            //   // TEMP FIX
            //   headerHeight = 50;
            // }

            // if( headerMainObj && headerMainObj.offsetHeight > 0) {
            //   headerHeight += headerMainObj.offsetHeight;
            // }
            // else if( headerNavObj && headerNavObj.offsetHeight > 0) {
            //   headerHeight += headerNavObj.offsetHeight;
            // }

            // if( $rootScope.getQuery('search') ) {
            //   // console.log('Search ON!');
            //   // console.log(headerSearchObj.offsetHeight);
            //   headerHeight += 40;
            // }
            $rootScope.dom.headerHeight = headerHeight;
            $rootScope.dom.pageHeight = windowHeight - headerHeight - footerHeight;
        };
        angular.element($window).bind('resize', function() {
            $rootScope.resize();
        });

        // $rootScope.resize();

        var toBoolean = function(value) {
            if (value && value.length !== 0) {
                var v = ("" + value).toLowerCase();
                value = !(v === 'f' || v === '0' || v === 'false' || v === 'no' || v === 'n' || v === '[]');
            } else {
                value = false;
            }
            return value;
        };
/** +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
        // check when a given pdf file be included to server filtered data
        $rootScope.checkServerFiltered = function(pdf_id){
            var pdfFiltered = $rootScope.yao.filterdItems;
            if(pdfFiltered === undefined || pdfFiltered == null || pdfFiltered.length == 0)
                return false;
            for (var i = 0; i < pdfFiltered.length; i ++) {
                if(pdfFiltered[i].id * 1 == pdf_id * 1){
                    // console.log(pdf_id);
                    return true;
                }
            }
            return false;
        }

        // check if 'key' is included in 'str'
        $rootScope.checkInclude = function (str, key){
            if(key == '') return true;

            if(str.toLowerCase().indexOf(key.toLowerCase()) == -1 )
                return false;
            return true;
        }

        // check if a given subcategories or items include 'key' or ...
        $rootScope.checkArrayInclude = function(ary, key){
            if(!ary)
                return false;

            for (var i = 0; i < ary.length; i ++){
                if(ary[i].deleted == false && ary[i].assigned == true){
                    if (ary[i].name !== undefined && $rootScope.checkInclude(ary[i].name, key)){
                        return true;
                    }
                    else if (ary[i].title !== undefined && 
                        ( $rootScope.checkInclude(ary[i].title, key) || $rootScope.checkServerFiltered(ary[i].id) ) ){
                        return true;
                    }
                }
            }

            return false;
        };





/** +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
        $rootScope.$watch('fields.searchValue', function(val) {
            if (val === null) {

            } else if (val === '') {
                var newURL = $rootScope.addQuery('search=' + val);
                if (newURL !== '' && newURL !== null && newURL !== undefined) {
                    console.log(newURL);
                    $window.location.href = newURL;
                    console.log($routeParams);
                }
            } else if (val !== '') {
                // alert('changed')
                var newURL = $rootScope.addQuery('search=' + val);
                if (newURL !== '' && newURL !== null && newURL !== undefined) {
                    console.log(newURL);
                    $rootScope.yao.searchPDFs(1, val, function(resp, err){
                        if(!err){
                            $rootScope.yao.filterdItems = resp;
                            console.log(resp);
                            $window.location.href = newURL;
                            // accordion.expandALl();
                        }
                    });
                    // $window.location.href = newURL;
                    console.log($routeParams);
                }
            }



        });

        $http.get('resources/settings.json').then(function(response) {
            // $rootScope.fields.localStorageKey = response.data.type + '.' + response.data.event;
            $rootScope.fields.appType = response.data.type;
            $rootScope.fields.appTypes = response.data.type + 's';
            // $scope.getObjects();
            var callback = function() {
                $rootScope.safeApply();
            };
            // $rootScope.cosmic.getObjects($rootScope.brochureData.type_slug, callback);
        });

        $rootScope.brochureData = {
            type: "rosters",
            type_slug: "roster-objects",
        };

        ////////////

        // COSMIC JS
        // $rootScope.cosmic.

        $rootScope.cosmic.addAnalyticObject = function(message) {
            if ($rootScope.interact.auth && $rootScope.interact.profile !== null) {
                var object = {
                    write_key: $rootScope.cosmic.config.bucket.write_key,
                    type_slug: 'analytic-objects',
                    title: 'id-' + $rootScope.interact.profile.uId,
                    content: '',
                    metafields: [
                        { 'key': 'date', 'type': 'text', 'value': Date.now() },
                        { 'key': 'event', 'type': 'text', 'value': message }
                    ]
                };
                Cosmic.addObject($rootScope.cosmic.config, object, function(error, response) {
                    if (error !== false) {
                        console.log(error);
                    }
                    console.log(response);
                });
            }
        };
        $rootScope.cosmic.addMedia = function(file, callback) {
            var formData = new FormData();

            formData.append('media', file);
            formData.append('write_key', $rootScope.cosmic.config.bucket.write_key);

            $http.post('https://api.cosmicjs.com/v1/' + $rootScope.cosmic.config.bucket.slug + '/media/', formData, {
                    withCredentials: false,
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                })
                .then(function(response) {
                    if (response) {
                        $window.console.log('$rootScope.cosmic.addMedia():' + response);
                        if (callback) {
                            callback(response);
                        }
                    }
                });
        };

        $rootScope.cosmic.addObject = function(data, callback) {
            var object = {
                write_key: $rootScope.cosmic.config.bucket.write_key,
                type_slug: data.type_slug,
                title: data.slug,
                content: '',
                metafields: data.metafields,
            };
            Cosmic.addObject($rootScope.cosmic.config, object, function(error, response) {
                if (error !== false) {
                    console.log(error);
                }
                console.log(response);
                if (callback) {
                    callback();
                }
                $rootScope.cosmic.addAnalyticObject('Added new object: ' + data.id + ' type: ' + data.slug);
            });
        };
        $rootScope.cosmic.editObject = function(data, callback) {
            var object = {
                slug: data.slug,
                write_key: $rootScope.cosmic.config.bucket.write_key,
                metafields: data.metafields,
            };
            Cosmic.editObject($rootScope.cosmic.config, object, function(error, response) {
                if (error !== false) {
                    console.log(error);
                }
                console.log(response);
                if (callback) {
                    callback();
                }
                $rootScope.cosmic.addAnalyticObject('Updated object: ' + data.id);

            });
        };
        $rootScope.cosmic.getObjects = function(type, callback) {
            // console.log('getObjects();' + type);

            if (type === 'all' || type === '') {
                Cosmic.getObjects($rootScope.cosmic.config, function(error, response) {
                    if (error !== false) {
                        console.log(error);
                    }
                    // console.log(response);
                    if (callback) {
                        callback(response);
                    }
                    console.log('loading === ' + $rootScope.fields.loading);
                    $rootScope.fields.loading = false;
                });
            } else {
                var params = {
                    type_slug: type,
                    limit: 10000,
                    skipe: 0
                };
                // if(type === 'rosters') {
                //   params.type_slug = 'roster-objects';
                // }
                // else if( type === 'contacts' ) {
                //   params.type_slug = 'contact-objects';
                // }
                Cosmic.getObjectType($rootScope.cosmic.config, params, function(error, response) {
                    if (error !== false) {
                        console.log(error);
                    }
                    if (response) {


                        $rootScope.fields.loading = false;
                        $rootScope.fields.refresh = false;

                        var newObjs = [];
                        if (response.objects.all) {
                            for (var i = 0; i < response.objects.all.length; i++) {
                                var item = response.objects.all[i];
                                if (item.metafield.deleted && toBoolean(item.metafield.deleted.value) === false) {
                                    if (item.metafield.live && toBoolean(item.metafield.live.value) === true) {
                                        newObjs.push(item);
                                    }
                                }
                            }
                            if (type === $rootScope.data.structure.objects[0].type_slug) {
                                var allCat = {
                                    slug: 'all',
                                    metafield: {
                                        deleted: {
                                            title: '',
                                            value: '',
                                        },
                                        imageURL: {
                                            title: '',
                                            value: 'images/logo.png',
                                        },
                                        imageName: {
                                            title: '',
                                            value: 'ALL',
                                        },
                                        name: {
                                            title: '',
                                            value: 'All',
                                        }
                                    }
                                };
                                $rootScope.data.categories = [];
                                $rootScope.data.categories.push(allCat);
                                $rootScope.data.categories = $rootScope.data.categories.concat($rootScope.sortOrder(newObjs));
                                // $rootScope.data.categories = $rootScope.sortOrder(newObjs);
                                $rootScope.loadPage('reload');
                            } else if (type === $rootScope.data.structure.objects[1].type_slug) {
                                $rootScope.data.content = newObjs;
                                $rootScope.loadPage('reload');

                            }
                            if ($rootScope.data.content && $rootScope.data.categories) {
                                $rootScope.appLoad();
                                $rootScope.$broadcast('data-loaded', { slug: { test: 'test' } });
                            }
                            $rootScope.GetLocalStorage();

                            //   for( var i = 0; i < response.objects.all.length; i++ ) {
                            //     var item = response.objects.all[i];
                            //     // console.log(item.metafield.deleted);
                            //     // console.log(item.metafield.live);
                            //     if( item.metafield.deleted && toBoolean(item.metafield.deleted.value) === false  ) {
                            //       if( item.metafield.live && toBoolean(item.metafield.live.value) === true ) {
                            //         if( item.metafield.imageURL && item.metafield.imageURL.value ) {
                            //           item.metafield.imageURL.value = item.metafield.imageURL.value.replace(/ /g, '%20');
                            //         }

                            //         $rootScope.posters.push(item);
                            //         // console.log(item);
                            //       }
                            //     }
                            //   }
                            //   var sorted = [];
                            //   sorted = $rootScope.posters.sort(function(a,b) {
                            //     var objA = a.metafield.name.value.toLowerCase();
                            //     var objB = b.metafield.name.value.toLowerCase();
                            //     if( objA < objB ) {
                            //       return -1;
                            //     }
                            //     else if( objA > objB) {
                            //       return 1;
                            //     }
                            //     else {
                            //       return 0;
                            //     }
                            //   });
                            //   if( callback ){
                            //     callback(response);
                            //   }

                        }
                    }
                });
            }
        };

        ///////////

        /*++++++++++++++++++++++++++++++++++++++++++++++++++ YAO API +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
        $rootScope.yao.getAssetData = function(assetNo, callback) {
            yao.assetData(assetNo).then(function(assetData) {
                console.log(assetData);
                $rootScope.yao.data = assetData;
                $rootScope.loadPage('reload');
                if(callback)
                    callback(true);
            }).catch(function(error) {
                if(callback)
                    callback(false);
                console.log(error);
            })
        };

        $rootScope.yao.searchPDFs = function(assetNo, keyword, callback) {
            yao.searchPDF(assetNo, keyword).then(function(foundItems) {
                console.log(foundItems);
                // $rootScope.yao.data = assetData;
                // $rootScope.loadPage('reload');
                if(callback)
                    callback(foundItems, false);
            }).catch(function(error) {
                if(callback)
                    callback([], true);
                console.log(error);
            })
        };        
        /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

        $rootScope.getCurrentPage = function() {
            return $location.path();
        };
        $rootScope.closeSearch = function() {
            var final = '';
            var searchIndex = $location.path().indexOf('/search');
            if (searchIndex !== -1) {
                final = $location.path().slice(0, searchIndex);
                $location.url(final);
            }
        };


        $rootScope.toggleFavourites = function() {
            if ($location.path().indexOf('/favourites') !== -1) {
                $rootScope.loadPage('/all');
            } else {
                $rootScope.loadPage('/favourites');
            }
        };

        $rootScope.encodeURL = function(url) {
            return encodeURIComponent(url);
        }

        $rootScope.loadPage = function(url) {
            var final = '';
            // console.log(url);
            if (url === 'refresh') {
                //  final = $rootScope.location.newLocation;

                $rootScope.fields.refresh = true;

                // if ($rootScope.data.structure) {
                //     console.log($rootScope.data.structure.objects[0].type_slug);
                //     $rootScope.cosmic.getObjects($rootScope.data.structure.objects[0].type_slug);
                //     $rootScope.cosmic.getObjects($rootScope.data.structure.objects[1].type_slug);
                // }
                $rootScope.yao.getAssetData(1, function(err){
                    // alert('aaa');
                    $rootScope.fields.loading = false;
                    $rootScope.fields.refresh = false;
                    if(err){
                        $rootScope.loadPage('reload');
                        $rootScope.appLoad();
                        // $rootScope.$broadcast('data-loaded', { slug: { test: 'test' } });
                    }
                    if(!err){
                        // alert('Refresh Error')
                        console.log('data refresh failed')
                    }
                });
                // $route.reload();
            } else if (url === 'reload') {
                $route.reload();
            } else if (url === 'home') {
                final += '#/';
            } else if (url === 'filters') {
                $rootScope.popup.filters = !$rootScope.popup.filters;
            } else if (url === 'edit') {
                var editIndex = $location.path().indexOf('/edit');
                if (editIndex !== -1) {
                    final += '#' + $location.path().slice(0, editIndex);
                } else {
                    final += '#' + $location.path();
                }
                final += '/edit:';
            } else if (url === 'back') {
                // console.log('lastLocation: ' + $rootScope.location.lastLocation);
                if ($rootScope.location.lastLocation === null || $rootScope.location.lastLocation === undefined || $rootScope.location.lastLocation === '') {
                    final += '#/';
                } else if ($location.path().indexOf('/category') !== -1) {
                    // console.log($location.path());
                    var editIndex = $location.path().indexOf('/category');
                    if (editIndex !== -1) {
                        final += '#' + $location.path().slice(0, editIndex);
                    }
                    // else if( )
                    else {

                        final += $rootScope.location.lastLocation;
                        // console.log('loadpage back final = ' + final);
                    }
                } else {
                    final += $rootScope.location.lastLocation;
                    // console.log('loadpage back final = ' + final);
                }
            } else {
                final += url;
            }
            return final;
        };

        // $rootScope.loadPage = function(page, id) {
        //   // $window.console.log(page);
        //   var final = '';
        //   // $window.console.log($location.path());
        //   // if( page.indexOf('/') !== -1 ) {

        //   // }
        //   if( page === 'refresh' ) {
        //       page = $location.path();
        //       console.log(page);
        //       // $location.url(page);
        //       $rootScope.fields.searchValue = null;
        //       $rootScope.fields.refresh = true;
        //       $route.reload();
        //   }
        //   if( page === '/all' ) {
        //     final = '/all';
        //     $rootScope.fields.searchValue = null;
        //   }
        //   else if( page === '/favourites' ) {
        //     final = '/favourites';
        //     $rootScope.fields.searchValue = null;
        //   }
        //   else {
        //     if( $location.path().indexOf('all') !== -1 ) {
        //       // final = $location.path() + '/all';
        //     }
        //     else if($location.path().indexOf('') !== -1 ) {
        //       // final = $location.path() + ''
        //     }
        //     var searchIndex = $location.path().indexOf('/search');
        //     if( searchIndex !== -1 ) {
        //       final = $location.path().slice(0,searchIndex) + '/search';
        //       $window.console.log(final);
        //     }
        //     else {
        //       final = $location.path() + page;
        //     }
        //     if( id || id === '' ) {
        //       final += ':' + id;
        //     }
        //   }

        //   // $window.console.log(final);
        //   $location.url(final);
        // };

        $rootScope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };
        $rootScope.setState = function(poster, state) {
            $rootScope.safeApply(function() {
                poster.state = state;
            });
        };

        $rootScope.sortOrder = function(unsorted) {
            var sorted = [];
            if (unsorted) {
                sorted = unsorted.sort(function(a, b) {
                    var objA, objB;
                    if (a.metafield.order && a.metafield.order.value > 0) {
                        objA = a.metafield.order.value;
                    } else {
                        objA = 99999;
                    }
                    if (b.metafield.order && b.metafield.order.value > 0) {
                        objB = b.metafield.order.value;
                    } else {
                        objB = 99999;
                    }
                    // var objA = a.metafield.order.value ;
                    // var objB = b.metafield.order.value;
                    if (objA < objB) {
                        return -1;
                    } else if (objA > objB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
            return sorted;
        };

        $rootScope.loadData = function() {
            // $http.get('./resources/cosmic.json').then(function(response) {
            //     // $window.console.log(JSON.stringify(response.data));
            //     $rootScope.data.structure = response.data;
            //     $rootScope.fields.loading = false;


            //     $rootScope.cosmic.config = response.data.cosmic.config;
            //     console.log($rootScope.data.structure.objects[0].type_slug);
            //     console.log($rootScope.data.structure.objects[1].type_slug);
            //     $rootScope.cosmic.getObjects($rootScope.data.structure.objects[0].type_slug);
            //     $rootScope.cosmic.getObjects($rootScope.data.structure.objects[1].type_slug);
            // });
            $rootScope.fields.loading = false;
            $rootScope.yao.getAssetData(1);
            $rootScope.loadPage('back');
            // $rootScope.resize();
        };

        $rootScope.loadData();



        angular.element(document).ready(function() {
            window.setTimeout(function() {
                // jQuery('.loading-cover').fadeOut(1000);
            }, 1000);
            // window.location = "ni-action:getauthtoken?cb=getAuthToken";
        });
        $rootScope.interact = {
            auth: null,
            profile: null,
            analytics: {
                openTime: Date.now(),
                closeTime: 0,
            }
        };
        $rootScope.interact.findUserProfile = function(callback) {
            $window.console.log("findUserProfile();");
            jQuery.ajax({
                url: "https://services.interact.technology/rest/user/profile",
                type: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-nextinteract-authtoken": $rootScope.interact.auth.authtoken
                }
            }).done(function(response, textStatus, jqXHR) {
                $window.console.log(response);
                $rootScope.interact.profile = response;
                if (callback) {
                    callback(response);
                }
            });
        };

        window.toBoolean = function(value) {
            if (value && value.length !== 0) {
                var v = ("" + value).toLowerCase();
                value = !(v === 'f' || v === '0' || v === 'false' || v === 'no' || v === 'n' || v === '[]');
            } else {
                value = false;
            }
            return value;
        };


        window.getAuthToken = function(auth) {
            $window.console.log(auth);
            $rootScope.interact.auth = auth;
            var findUserProfileCallback = function() {

            };
            $rootScope.interact.findUserProfile(findUserProfileCallback);
        };
        // window.onbeforeunload = function() {
        //   if( $rootScope.interact.profile !== null ) {
        //     $rootScope.interact.analytics.closeTime = Date.now();
        //     var sessionTime = $rootScope.interact.analytics.closeTime - parseInt($rootScope.interact.analytics.openTime);
        //     console.log("Session time: " + sessionTime);
        //     $rootScope.cosmic.addAnalyticObject("user-" + $rootScope.interact.profile.uId + "." + "asset-rosters" + "." + "sessionTime-" + sessionTime);
        //   }
        //   window.document.location = "ni-action:close";
        // };


    });


posterApp.filter('filterView', function($scope) {
    return function(items, route, fields) {

        console.log($scope);
        console.log(items);
        var filtered = [];
        if (items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                // fields.empty = true
                console.log(fields.searchValue);
                if (fields.searchValue === null || fields.searchValue === '' || fields.searchValue === ' ') {
                    if (route === 'all') {
                        filtered.push(item);
                        // fields.empty = false

                    } else if (route === 'saved') {
                        if (item.state === 'view') {
                            // fields.empty = false
                            filtered.push(item);
                        }
                    }
                } else {
                    if (fields.searchValue !== null) {
                        var text = fields.searchValue.toLowerCase();
                        var result = false;
                        if (item.title.toLowerCase().indexOf(text) > -1) {
                            result = true;
                        } else if (item.text.toLowerCase().indexOf(text) > -1) {
                            result = true;
                        } else if (item.type.toLowerCase().indexOf(text) > -1) {
                            result = true;
                        }
                        for (var a = 0; a < item.authors.length; a++) {
                            if (item.authors[a].toLowerCase().indexOf(text) > -1) {
                                result = true;
                            }
                        }
                        for (var t = 0; t < item.tags.length; t++) {
                            if (item.tags[t].toLowerCase().indexOf(text) > -1) {
                                result = true;
                            }
                        }
                        // fields.empty = !result
                        if (result) {
                            if (route === 'all') {
                                filtered.push(item);
                            } else if (route === 'saved') {
                                if (item.state === 'view') {
                                    filtered.push(item);
                                }
                            }
                        }
                    }
                }

            }
        } else {
            console.log('Filtered All');
        }
        return filtered;
    };
});