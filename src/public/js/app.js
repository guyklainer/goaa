'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('App', ["ui.bootstrap", "ui.utils", "ngCookies"]).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider.
        when('/', {
            templateUrl: '/partials/login',
            controller: 'LoginCtrl'
        }).
        when('/home', {
            templateUrl: '/partials/home',
            controller: 'HomeCtrl'
        }).
        when('/signup', {
            templateUrl: '/partials/signup',
            controller: 'SignupCtrl'
        }).
        when('/test', {
            templateUrl: '/partials/test',
            controller: 'TestCtrl'
        }).
        when('/createGroup', {
            templateUrl: '/partials/createGroup',
            controller: 'CreateGroupCtrl'
        }).
        when('/joinGroup', {
            templateUrl: '/partials/joinGroup',
            controller: 'JoinGroupCtrl'
        }).
        when('/groupPreview/:groupName', {
            templateUrl: '/partials/groupPreview',
            controller: 'GroupPreviewCtrl'
        }).
        when('/group/:groupName', {
            templateUrl: '/partials/group',
            controller: 'GroupCtrl'
        }).
        when('/group/:groupName/settings', {
            templateUrl: '/partials/groupSettings',
            controller: 'GroupSettingsCtrl'
        }).
        when('/group/:groupName/todos', {
            templateUrl: '/partials/groupTodos',
            controller: 'GroupToDosCtrl'
        }).
        when('/group/:groupName/:view', {
            templateUrl: '/partials/group',
            controller: 'GroupCtrl'
        }).
        when('/group/:groupName/meters/:meter', {
            templateUrl: '/partials/meter',
            controller: 'MeterCtrl'
        }).
        when('/compose', {
            templateUrl: '/partials/composeView',
            controller: 'ComposeCtrl'
        }).
        when('/compose/:groupName',{
            templateUrl: '/partials/composeView',
            controller: 'ComposeCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
  }])
    .run(function($rootScope, account, $location) {

        log("application start");

        account.update();

        //redirect unautrize user to login
        if($location.path() != '/signup' && !account.isLoggedIn()){
            log("user not loggedin, redirecting to login");
            $location.path('/');
        }
    });
