'use strict';

angular.module('App').controller('SignupCtrl', ['$scope', '$http', '$location', 'blockui','account', '$timeout',
    function($scope, $http, $location, blockui, account, $timeout){

    $scope.hideMenu = true;

    // checking if logged in allready redirecting to Home
    if (account.isLoggedIn()){
        $location.path('/home')
    }

    // varibles
    var form = {
        firstName        : "",
        lastName         : "",
        username         : "",
        email            : "",
        password         : "",
        confirm_password : "",
        birthDay         : ""
    };

    var birthDayParts = {
           Day      : "" ,
           Month    : "",
           Year     : ""
    };


    // public vars
    $scope.form = form;
    $scope.birthDayParts = birthDayParts;

    // functions
    var signup = function(){

        log("signup for: ");
        form.birthDay=birthDayParts.Day+'/'+birthDayParts.Month+'/'+birthDayParts.Year;
        log(form);

        // checking that the password matches
        if (!isPasswordMatch()){
            $scope.confirmPasswordInvalid = true;
        } else if (!$scope.usernameInvalid){
            // clearing the ui errors notifications
            setFormToValid();

            // posting the user to the server
            blockui.block();
            $http.post('/signup', form)
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                })
                .success(function(data, status, headers, config) {
                    log(data);

                    // checking the user was created
                    if (data != null && data.result){ // case success
                        log("success");

                        // redirecting the Login page
                        blockui.unblock();
                        $timeout(function(){
                            account.update();

                            if (account.isLoggedIn()){
                                log('user is Logged In -> redirecting to home');
                                $location.path('/home').replace(); //redirect wont create new page in the history
                            } else {
                                log("user is not Logged In -> redirecting to login");
                                $location.path('/');
                            }

                        },1000);

                    } else { // case failure
                        log("failure");
                        blockui.unblock();

                        // notify the form error
                        $scope.formInvalid = true;
                        $scope.usernameInvalid = !data.isUsernameValid;
                        $scope.confirmPasswordInvalid = !data.isPasswordValid;
                    }
                });
        }
    }
    ,
    setFormToValid = function(){
        $scope.confirmPasswordInvalid = false;
        $scope.usernameInvalid = false;
        $scope.formInvalid = false;
    }
    ,
    isPasswordMatch = function(){
        return form.password == form.confirm_password;
    }
    ,
    validateUserName = function(username){
        log("validateUserName");
        var result = false;

        var params = {
            username: username
        };

        $http.post('/api/validateUsername', params)
            .error(function(data, status, headers, config){
                httpErrorCallback(data, status, headers, config);
            })
            .success(function(data, status, headers, config) {
                log(data);
                if (data != null
                    && data.result != null) {

                        $scope.usernameInvalid = data.result; // true only if exist
                        result = data.result;
                }
            });

        return result;
    };

    // public functions
    $scope.signup = signup;
    $scope.validateUserName = validateUserName;
    $scope.account = account;
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
