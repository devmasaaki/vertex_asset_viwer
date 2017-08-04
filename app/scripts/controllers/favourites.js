'use strict';

/**
 * @ngdoc function
 * @name posterAppApp.controller:FavouriteCtrl
 * @description
 * # FavouriteCtrl
 * Controller of the posterAppApp
 */
angular.module('posterAppApp')
  .controller('FavouriteCtrl', function ($scope, $rootScope, $window, $location, $routeParams ) {
  // .controller('MainCtrl', function ($scope, $rootScope, $location, $window, $http ) {

 
    $scope.update = false;

    // $scope.filteredPosters
    $scope.list = $rootScope.posters;

    $rootScope.$watch('$rootScope.posters', function( val) {
        // $window.console.log(val);
    });
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
    $scope.getItemById = function(id) {
        if( $rootScope.posters ) {
            for( var i = 0; i < $rootScope.posters.length; i++ ) {
                var item = $rootScope.posters[i];
                if( item.id === id ) {
                    $window.console.log(item);
                }             
            }
        }
    };  
    $scope.getObjects = function() {
        var callback = function(response) {
            console.log(response);
            // $rootScope.posters = response.objects.all;
            $scope.resetItems();
            // $rootScope.loadPage('/all');
        };
        $rootScope.cosmic.getObjects($rootScope.brochureData.type_slug, callback);
    };
    $scope.selectItem = function(item) {
        if( item.metafield.fileURL) {
            if( $rootScope.interact.profile !== null ) {
                $rootScope.cosmic.addAnalyticObject("user-" + $rootScope.interact.profile.uId + "." + "asset-tools" + "." + "open-" + item.metafield.fileName.value);
            }
            window.open(item.metafield.fileURL.value, '_blank');            
        }
    };

    $scope.resetItems = function() {
        if( $rootScope.posters ) {
            for( var i = 0; i < $rootScope.posters.length; i++ ) {
                var item = $rootScope.posters[i];
                item.isActive = false;
                // $window.console.log(item);
                $window.console.log('reset item');
            }
        }
    };
    $scope.getObjects();
});
  
posterApp.filter('favouritesFilter', function () {
    return function (items, fields) {
        var filtered = [];
        // console.log(fields);
         var text = '';
        if (items) {
            // console.log(items);
            if( fields.searchValue ) {
              text = fields.searchValue.toString().toLowerCase();                
            }
            // console.log(text);
            for ( var i = 0; i < items.length; i++) {
                var item = items[i];
                var result = false;
                var index = fields.localStorageData.indexOf(item.slug);
                // console.log($scope.favorites);
                if (index > -1) {
                    if( text === '' ){
                        result = true;
                    }
                    else {
                        // console.log(item);

                        if( item.metafield.name && item.metafield.name.value.toString().toLowerCase().indexOf(text) > -1) { result = true;  }
                        // if( item.metafield.date && item.metafield.date.value.toString().toLowerCase().indexOf(text) > -1) { result = true;  }
                        if( item.metafield.description && item.metafield.description.value.toString().toLowerCase().indexOf(text) > -1) { result = true;  }
                        // if( item.metafield.fileURL && item.metafield.fileURL.value.toString().toLowerCase().indexOf(text) > -1) { result = true;  }
                        
                        // if( item.metafield.job.value.toString().toLowerCase().indexOf(text) > -1) { result = true; }
                        // if( item.metafield.department.value.toString().toLowerCase().indexOf(text) > -1) { result = true; }
                        // if( item.metafield.mobile.value.toString().toLowerCase().indexOf(text) > -1) { result = true; }
                        // if( item.metafield.email.value.toString().toLowerCase().indexOf(text) > -1) { result = true; }
                        // if( item.metafield.address.value.toString().toLowerCase().indexOf(text) > -1) { result = true; }
                        // if( item.metafield.suburb.value.toString().toLowerCase().indexOf(text) > -1) { result = true; }
                        // if( item.metafield.postCode.value.toString().toLowerCase().indexOf(text) > -1) { result = true; }
                        // if( item.metafield.state.value.toString().toLowerCase().indexOf(text) > -1) { result = true; }
                        // if( item.metafield.phone.value.toString().toLowerCase().indexOf(text) > -1) { result = true; }
                        // if( item.metafield.fax.value.toString().toLowerCase().indexOf(text) > -1) { result = true; }
                    }
                }
                
                if( result) {
                    filtered.push(item);
                }
            }
        }
        return filtered;
    };
});
