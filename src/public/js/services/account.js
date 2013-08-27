"use strict";

angular.module('App').factory('account', ['$cookies', '$http', '$location', '$cookieStore', function($cookies, $http, $location, $cookieStore){

    var loggedInUser = null
        ,
        isLoggedIn = function(){
            return loggedInUser != null;
        }
        ,
        update = function() {
            log("account init");

            //getting the user from the cookie
            var user = $cookies.user || {};
            user = user.substr(2,user.length);

            //parsing from string to js
            if (user != "null") {
                loggedInUser = JSON.parse(user);
                $cookieStore.remove('user');
            }

            log("user: ");
            log(loggedInUser);
            log("isLoggedIn: " + isLoggedIn());


        },
        logout= function(){
            log("logout");
            NProgress.start();
            $http.post('/logout', {})
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
                    log("logout success");
                    log(data);
                    loggedInUser = null;
                    $location.path('/');
                });
        };

    // Public API here
    return {
        isLoggedIn: isLoggedIn,
        user: function() { return loggedInUser; },
        update:update,
        logout: logout
    };
}]);