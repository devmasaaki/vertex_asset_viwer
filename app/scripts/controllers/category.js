'use strict';

/**
 * @ngdoc function
 * @name posterAppApp.controller:CategoryCtrl
 * @description
 * # CategoryCtrl
 * Controller of the posterAppApp
 */
angular.module('posterAppApp')
  .controller('CategoryCtrl', function ($scope, $rootScope, $window, $location, $routeParams ) {
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

    $scope.checkValidImage = function(url) {
      var result = url;
      // console.log(url);
      if( result === '') {
        result = './images/thumbnail.png';
      }
      else {
        // $$$ replace spaces in url name with %20, consider adding this to admin not viewer
        result = result.replace(/ /g, '%20');
      }
      return result;
    };

    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase === '$apply' || phase === '$digest') {
        if(fn && (typeof(fn) === 'function')) {
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

    console.log($rootScope.data.content);
    console.log($rootScope.data.categories);


});

posterApp.filter('categoryFilter', function() {
  return function(items, fields) {
    console.log(items);
    // console.log('CONTENT FILTER');
    // console.log(items);
    // console.log(fields);
    var filtered = [];
    if( items && items.length > 0 ) {
      for( var i = 0; i < items.length; i++ ){
        var item = items[i];
        var result = true;

        if( item.metafield.deleted !== undefined  && window.toBoolean( item.metafield.deleted.value ) ) {
          result = false;
        }
        else{
          if( fields && fields.searchValue ) {
            var text = fields.searchValue.toLowerCase();
            // console.log(text);
            // console.log(item);
            if (item.metafield.name.value.toLowerCase().indexOf(text) > -1) {
              console.log('test');
              result = true;
            }
            else {
              result = false;
            }
          }
        }
        if( result ) {
        // if( true ) {
          filtered.push(item);
        }
      }
    }
    console.log(filtered);
    return filtered;
  };
});
