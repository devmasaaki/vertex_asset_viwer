'use strict';

/**
 * @ngdoc function
 * @name posterAppApp.controller:CategoryCtrl
 * @description
 * # CategoryCtrl
 * Controller of the posterAppApp
 */
angular.module('posterAppApp')
    .controller('CategoryCtrl', function($scope, $rootScope, $window, $location, $routeParams) {
        // .controller('CategoryCtrl', function ($scope, $rootScope, $location, $window, $http ) {

        $scope.pageClass = 'page-category';
        // $scope.update = false;

        // $scope.filteredPosters
        // unsorted = $rootScope.posters;

        $rootScope.removeQuery('search');
        // console.log($routeParams);
        $rootScope.resize();

        $scope.setPageSlug = function(item) {
            $rootScope.searchcat = false;
            $rootScope.fields.searchValue = null;
            $rootScope.location.pageSlug = item.slug;
        };

        $scope.checkInclude = function(value, keyword) {
            if ($rootScope.fields && $rootScope.fields.searchValue) {
                var text = $rootScope.fields.searchValue.toLowerCase();
                // console.log(text);
                // console.log(item);
                if (value.toLowerCase().indexOf(text) > -1) {
                    return true;
                }

            }
            return false;
        }

        $scope.checkValidImage = function(url) {
            var result = url;
            // console.log(url);
            if (result === '') {
                result = './images/thumbnail.png';
            } else {
                // $$$ replace spaces in url name with %20, consider adding this to admin not viewer
                result = result.replace(/ /g, '%20');
            }
            return result;
        };

        $scope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };



        $scope.toBoolean = function(value) {
            if (value && value.length !== 0) {
                var v = ("" + value).toLowerCase();
                value = !(v === 'f' || v === '0' || v === 'false' || v === 'no' || v === 'n' || v === '[]');
            } else {
                value = false;
            }
            return value;
        };
        // $scope.getItemById = function(id) {
        //     if( $rootScope.posters ) {
        //         for( var i = 0; i < $rootScope.posters.length; i++ ) {
        //             var item = $rootScope.posters[i];
        //             if( item.id === id ) {
        //                 $window.console.log(item);
        //             }
        //         }
        //     }
        // };
        // $scope.getObjects = function() {
        //     var callback = function(response) {
        //         console.log(response);
        //         // $rootScope.posters = response.objects.all;
        //         // $scope.resetItems();
        //         // $rootScope.loadPage('/all');
        //     };
        //     $rootScope.cosmic.getObjects($rootScope.brochureData.type_slug, callback);
        // };
        // $scope.selectItem = function(item) {
        //     if( item.metafield.fileURL) {
        //         if( $rootScope.interact.profile !== null ) {
        //             $rootScope.cosmic.addAnalyticObject("user-" + $rootScope.interact.profile.uId + "." + "asset-tools" + "." + "open-" + item.metafield.fileName.value);
        //         }
        //         window.open(item.metafield.fileURL.value, '_blank');
        //     }
        // };

        // $scope.resetItems = function() {
        //     if( $rootScope.posters ) {
        //         for( var i = 0; i < $rootScope.posters.length; i++ ) {
        //             var item = $rootScope.posters[i];
        //             item.isActive = false;
        //             // $window.console.log(item);
        //             $window.console.log('reset item');
        //         }
        //     }
        // };
        // $scope.getObjects();
        $scope.toggle = true;
        $scope.itoggle = true;

        // console.log($rootScope.data.content);
        // console.log($rootScope.data.categories);

        // $scope.$on('my-accordion:onReady', function () {
        //     var firstPane = $scope.panes[0];
        //     $scope.accordion.toggle(firstPane.id);
        //   });

    });

posterApp.filter('categoryFilter', function($rootScope) {
    return function(items, fields) {
        // console.log(items);
        // console.log('CONTENT FILTER');
        // console.log(items);
        // console.log(fields);
        var filtered = [];

        var categories = items;

        var checkCategoryInclude = function(cat, text){
            // category is deleted? or not assigned?
            if (cat.deleted === undefined || cat.deleted || !cat.assigned)
                return false;

            if ($rootScope.checkInclude(cat.name, text))
                return true;
            
            if(cat.items && $rootScope.checkArrayInclude(cat.items, text))
                return true;

            var subcategories;
            if (cat.subcategories && $rootScope.checkArrayInclude((subcategories = cat.subcategories) , text) )
                return true;

            for (var i = 0; i < subcategories.length; i++) {
                if(subcategories[i].items && $rootScope.checkArrayInclude(subcategories[i].items, text))
                    return true;
            }

            return false;
        };

        var text = '';
        if (fields && fields.searchValue && fields.searchValue != '') 
            text = fields.searchValue;

        if (categories && categories.length > 0) {
            for (var i = 0; i < categories.length; i++) {
                if (text == '' || checkCategoryInclude(categories[i], text)) {
                    filtered.push(categories[i]);
                }
            }
        }
        // console.log(filtered);
        return filtered;

    };
});

posterApp.filter('subcategoryFilter', function($rootScope) {
    return function(items, fields) {
        //console.log(items);
        var filtered = [];

        var subs = items;
        var text = '';
        if(fields && fields.searchValue)
            text = fields.searchValue;

        for (var i = 0; i < subs.length; i ++){
            if ( $rootScope.checkInclude(subs[i].name, text) || $rootScope.checkArrayInclude(subs[i].items, text))
                filtered.push(subs[i]);
        }

        return filtered;
    };
});

posterApp.filter('pdfcategoryFilter', function($rootScope) {
    return function(items, fields) {
        //console.log(items);
        var filtered = [];

        var pdfs = items;
        var text = '';
        if(fields && fields.searchValue)
            text = fields.searchValue;

        for (var i=0; i<pdfs.length; i ++){
            if( text == '' || $rootScope.checkInclude(pdfs[i].title, text) || $rootScope.checkServerFiltered(pdfs[i].id)){
                filtered.push(pdfs[i]);
            }
        }

        return filtered;
    };
});

posterApp.filter('orderObjectBy', function(){
    return function(items, reverse){
        var filtered = [];

        angular.forEach(items, function (item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a.sort*1 > b.sort*1 ? 1 : -1);
        });

        if (reverse) filtered.reverse();

        return filtered;
    };
});