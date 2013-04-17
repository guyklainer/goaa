'use strict';

// Declare app level module which depends on filters, and services
angular.module('App', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

        $routeProvider.when('/test', {
            controller: TestCtrl,
            template: '<h1> {{ test }} </h1>'
        });
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: IndexCtrl
      }).
//      when('/addPost', {
//        templateUrl: 'partials/addPost',
//        controller: AddPostCtrl
//      }).
//      when('/readPost/:id', {
//        templateUrl: 'partials/readPost',
//        controller: ReadPostCtrl
//      }).
//      when('/editPost/:id', {
//        templateUrl: 'partials/editPost',
//        controller: EditPostCtrl
//      }).
//      when('/deletePost/:id', {
//        templateUrl: 'partials/deletePost',
//        controller: DeletePostCtrl
//      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);

//angular.module('App', []).config(function ($routeProvider) {
//
//    $routeProvider.when('/', {
//        controller: TestCtrl,
//        template: '<h1> {{ test }} </h1>'
//    });
//
//});
//
function TestCtrl($scope) {
    $scope.test = "Works!";
}
