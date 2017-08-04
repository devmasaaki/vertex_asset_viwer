'use strict';

/**
 * @ngdoc function
 * @name posterAppApp.controller:ContentCtrl
 * @description
 * # ContentCtrl
 * Controller of the posterAppApp
 */
angular.module('posterAppApp')
  .factory('PagerService', function() {
    var service = {};
    service.GetPager = GetPager;
    return service;
  // service implementation
  function GetPager(totalItems, currentPage, pageSize) {
    // default to first page
    currentPage = currentPage || 1;

    // default page size is 10
    pageSize = pageSize || 10;

    // calculate total pages
    var totalPages = Math.ceil(totalItems / pageSize);
    // console.log(totalItems + ' ' + pageSize);
    // console.log(totalPages);

    var startPage, endPage;

    var range = 1;

    startPage = currentPage - 1;
    endPage = currentPage + 1;

    if( currentPage === 1 ) {
      startPage = 1;
      endPage += 1;
    }
    else if( endPage > totalPages ) {
      if( startPage - 1 > 0 ) {
        startPage -= 1;
      }
      else {
        startPage = 1;
      }

      endPage = totalPages;
    }
    if( endPage > totalPages ) {
      endPage = totalPages;
    }
    // console.log(startPage + ' ' + endPage);

    // calculate start and end item indexes
    var startIndex = (currentPage -1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    var pages = _.range(startPage, endPage+1);
    // console.log(pages);
    // return object with all pager properties required by the view
    return {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
    };
  }
}).controller('ContentCtrl', function ($scope, $rootScope, PagerService, $routeParams, $filter  ) {
// .controller('ContentCtrl', function ($scope, $rootScope, $location, $window, $http ) {
  $scope.contentData = {
    loading: true,
  };


  var oldIndex = $rootScope.location.lastLocation.indexOf('/content:');
  var newIndex = $rootScope.location.newLocation.indexOf('/content:');


  if( oldIndex !== -1 && newIndex !== -1) {
    // console.log($rootScope.location.lastLocation);
    // console.log($rootScope.location.newLocation);
    $scope.pageClass = 'page-content-search';
  }
  else if( oldIndex !== -1 && newIndex === -1) {
    $scope.pageClass = 'page-content';
  }
  // else if( $routeParams.search ) {
  //   $scope.pageClass = 'page-content-search';
  // }
  else {
    $scope.pageClass = 'page-content';
  }

  $scope.$on('data-loaded', function(event, args) {
    console.log('content.js: data-loaded!');
    console.log(args);
    $scope.contentLoad();
  });

  $rootScope.$on('$locationChangeStart', function(event, newURL, oldURL) {
    // console.log('old: ' + oldURL);
    // console.log('new: ' + newURL);
    var oldIndex = oldURL.indexOf('/content:');
    var newIndex = newURL.indexOf('/content:');

    if( oldIndex !== -1 && newIndex !== -1) {
      // console.log($rootScope.location.lastLocation);
      // console.log($rootScope.location.newLocation);
      $scope.pageClass = 'page-content-search';
    }
    else if( oldIndex !== -1 && newIndex === -1) {
      console.log( 'YAY?');
      $scope.pageClass = 'page-content';
    }
    // else if( $routeParams.search ) {
    //   $scope.pageClass = 'page-content-search';
    // }
    else {
      $scope.pageClass = 'page-content';
    }

    // $rootScope.location.newLocation = newURL;
    // $rootScope.location.lastLocation = oldURL;
  });


  console.log( $routeParams);
  var pageName = $routeParams.name.replace(/:/, '');
  pageName = pageName.replace(/%20/g, ' ');
  pageName = pageName.replace(/%2F/g, '/');

  $rootScope.location.pageName = pageName;
  // $rootScope.location.pageSlug =

  // if( $rootScope.location.pageSlug === '' ) {
  //   var categoryData = $rootScope.getCategoryData(pageName);
  //   console.log(categoryData);
  //   if( categoryData ) {
  //     $rootScope.location.pageSlug = categoryData.slug;
  //     $scope.category = categoryData;
  //   }
  // }
  // $scope.content.loading = true;

  $scope.category = null;
  $scope.categories = $rootScope.data.categories;
  $scope.filtered = [];
  $scope.pager = {};
  $scope.setPage = setPage;


  function setPage(page) {
    if (page < 1 || page > $scope.pager.totalPages) {
        return;
    }
    // check favourites
    var temp = [];
    var favourites = [];
    var sorted = [];
    if( $rootScope.fields.favourites ) {
      for( var i = 0; i < $rootScope.data.content.length; i++ ) {
        // console.log( $rootScope.data.content[i]);
        if( $scope.checkIsFavourite($rootScope.data.content[i]) ){
          favourites.push($rootScope.data.content[i]);
        }
      }
      console.log(favourites);
      sorted = $rootScope.sortOrder(favourites);
    }
    else {
      sorted = $rootScope.sortOrder($rootScope.data.content);
    }
    temp = $filter('contentFilter')(sorted,$scope.category,$rootScope.fields);

    $scope.pager = PagerService.GetPager(temp.length, page);
    $scope.filtered = temp.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
  }

  $scope.validateURL = function(item) {
    var result = true;
    if( item && item.metafield.otherURL.value ) {
      result = true;
    }
    else {
      result = false;
    }
    return result;
  };
  $scope.validatePDF = function(item) {
    var result = true;
    if( item && item.metafield.fileURL ) {
        var urlIndex = item.metafield.fileURL.value.indexOf('.pdf');
        console.log(urlIndex);
        if( urlIndex !== -1 ) {
          result = true;
        } else {
          result = false;
        }
}
    // if( item && item.metafield.otherURL.value ) {
    //   var urlIndex = item.metafield.otherURL.value.indexOf('http');
    //   if( urlIndex !== -1 ) {
    //     result = true;
    //   }
    // }
    else {
      result = false;
    }
    return result;
  };

  $scope.viewPDF = function(item) {
    console.log(item);
    if( item ) {
      console.log(item);
      if( item.metafield.fileURL.value !== '' ) {
        window.open(item.metafield.fileURL.value, '_blank');
      }
    }
    else {
      console.log('viewPDF(); item invalid ' + item);
    }
  };
  $scope.viewURL = function(item) {
    if( item ) {
      console.log(item);
      if( item.metafield.otherURL.value ) {
        var urlIndex = item.metafield.otherURL.value.indexOf('http');
        if( urlIndex !== -1 ) {
          window.open(item.metafield.otherURL.value, '_blank');
        }
        else {
          window.open('https://'+item.metafield.otherURL.value, '_blank');
        }
      }
    }
    else {
      console.log('viewPDF(); item invalid ' + item);
    }
  };
  $scope.checkIsFavourite = function(item) {
    var result = false;
    if( item && $rootScope.data.favourites ) {

      for( var i = 0; i < $rootScope.data.favourites.length; i++ ) {

        if( item.slug === $rootScope.data.favourites[i] ) {
          console.log(item.slug + ' ' +  $rootScope.data.favourites[i] );
          result = true;
        }
      }
    }
    return result;
  };

  $scope.setFavourite = function(item) {
    if( item ) {
      console.log('content.js setFavourite('+ item.slug +')');
      if( item.slug && $rootScope.data.favourites ) {
        var itemIndex = $rootScope.data.favourites.indexOf(item.slug);
        if( itemIndex > -1 ) {
          // splice out item
          $rootScope.data.favourites.splice(itemIndex, 1);
        }
        else {
          $rootScope.data.favourites.push(item.slug);
        }
        $rootScope.SetLocalStorage();
      }
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

  $scope.contentLoad = function() {
    if( $rootScope.data.categories &&  $rootScope.data.content ) {
      for( var i = 0; i < $rootScope.data.categories.length; i++ ) {
        var category = $rootScope.data.categories[i];
        //  console.log(category.metafield.name.value + ' ' + pageName);
        if( pageName === category.metafield.name.value ){
          $scope.category = category;
        }
      }
      if( $scope.category) {
        // console.log($scope.category);
        $scope.contentData.loading = false;
        $scope.setPage(1);
      }
    }
  };
  $scope.contentLoad();
}).filter('contentFilter', function() {
  return function(items, category, fields) {
    var returnList = [];
    if( items && items.length > 0 ) {
      for( var i = 0; i < items.length; i++ ){
        var item = items[i];
        var result = true;
        if( item.metafield.deleted !== undefined  && window.toBoolean( item.metafield.deleted.value ) ) {
          result = false;
        }
        if( category  ) {
          if( category.slug !== 'all' && category.slug !== item.metafield.category.value) {
          // console.log(category.slug + ' ' + item.metafield.category.value );
            result = false;
          }
        }
        if( fields && fields.searchValue === '' ) {

        }
        else if( fields && fields.searchValue ) {
          var text = fields.searchValue.toLowerCase();
          // console.log(text);
          if (item.metafield.name.value.toLowerCase().indexOf(text) > -1) {
            // console.log('test');
          }
          else {
            result = false;
          }
        }
        if( result ) {
          returnList.push(item);
        }
      }
    }
    console.log(returnList);
    return returnList;
  };
});
