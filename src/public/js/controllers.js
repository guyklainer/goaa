'use strict';

/* Controllers */
angular.module('App').controller('LoginCtrl', ['$scope', 'loggedInUser', function($scope, loggedInUser){
    /*$http.get('/api/posts').
     success(function(data, status, headers, config) {
     $scope.posts = data.posts;
     });//*/
    $scope.form = {
        email: "",
        password: "",
        remeberme: false
    };
    $scope.login = function(){
        log("login for email: " + $scope.form.email);
        //todo: login here

    }
}]);

angular.module('App').controller('SignupCtrl', ['$scope', function($scope){
    //varibles
    $scope.form = {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirm_password: ""
    };

    //functions
    $scope.signup = function(){
        log("signup for: ");
        log($scope.form);
        //todo: signup here
    }
}]);

//function AddPostCtrl($scope, $http, $location) {
//  $scope.form = {};
//  $scope.submitPost = function () {
//    $http.post('/api/post', $scope.form).
//      success(function(data) {
//        $location.path('/');
//      });
//  };
//}
//
//function ReadPostCtrl($scope, $http, $routeParams) {
//  $http.get('/api/post/' + $routeParams.id).
//    success(function(data) {
//      $scope.post = data.post;
//    });
//}
//
//function EditPostCtrl($scope, $http, $location, $routeParams) {
//  $scope.form = {};
//  $http.get('/api/post/' + $routeParams.id).
//    success(function(data) {
//      $scope.form = data.post;
//    });
//
//  $scope.editPost = function () {
//    $http.put('/api/post/' + $routeParams.id, $scope.form).
//      success(function(data) {
//        $location.url('/readPost/' + $routeParams.id);
//      });
//  };
//}
//
//function DeletePostCtrl($scope, $http, $location, $routeParams) {
//  $http.get('/api/post/' + $routeParams.id).
//    success(function(data) {
//      $scope.post = data.post;
//    });
//
//  $scope.deletePost = function () {
//    $http.delete('/api/post/' + $routeParams.id).
//      success(function(data) {
//        $location.url('/');
//      });
//  };
//
//  $scope.home = function () {
//    $location.url('/');
//  };
//}
