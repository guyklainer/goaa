'use strict';

// Declare app level module which depends on filters, and services
angular.module('App', ["ui.bootstrap", "ngCookies"]).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider.
        when('/', {
            templateUrl: 'partials/login',
            controller: 'LoginCtrl'
        }).
        when('/home', {
            templateUrl: 'partials/home',
            controller: 'HomeCtrl'
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
  }])
    .run(function($rootScope, $location, $cookies) {

        log("userRole");
        var user = $cookies.user || {};
        user = user.substr(2,user.length);
        log(user);
        log(JSON.parse(user));
//        log($cookies.get('user'));
//        $rootScope.user = $cookieStore.get('user');// || {username: ""};
//        log($rootScope.userRole);

//        $cookieStore.remove('userRole');

    });
