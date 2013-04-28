'use strict';

// Declare app level module which depends on filters, and services
angular.module('App', ["ui.bootstrap"]).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider.
        when('/', {
            templateUrl: 'partials/login',
            controller: 'LoginCtrl'
        }).
        when('/login-failed', {
            templateUrl: 'partials/failed'
        }).
        when('/login-success', {
            templateUrl: 'partials/signup',
            controller: 'SignupCtrl'
        }).
        when('/signup', {
            templateUrl: 'partials/signup',
            controller: 'SignupCtrl'
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
  }]);
