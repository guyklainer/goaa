'use strict';

/* Services */

angular.module('App').factory('blockui', ['$dialog', function($dialog){

    var diagOptions = {
        backdrop: true,
        keyboard: false,
        backdropClick: false,
        templateUrl:  'partials/blockui.ejs'
    },
    blockui = $dialog.dialog(diagOptions)
    ,
    isOpen = false
    ,
    timeout = 15 * 1000 // in millisec
    ,
    block = function() {
        log("block");
        if (isOpen) {
            log("modal allready opened");
        } else {
            blockui.open();
            isOpen = true;

            // unblock after timeout
            setTimeout(function() {
                if (isOpen) {
                    log("timeout over - unblocking");
                    unblock();
                }
            }, timeout);
        }
    }
    ,
    unblock = function(){
        log("unblock");
        blockui.close();
        isOpen = false;
    };


    // Public API here
    return {
        block: block,
        unblock: unblock
    };
}]);

angular.module('App').factory('account', ['$cookies', '$http', '$location', function($cookies, $http, $location){

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
            }

            log("user: ");
            log(loggedInUser);
            log("isLoggedIn: " + isLoggedIn());


        },
        logout= function(){
            log("logout");
            $http.post('/logout', {})
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                })
                .success(function(data, status, headers, config) {
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

angular.module('App').factory('db', ['$cookies', '$http', '$location', function($cookies, $http, $location){

    var db = {}
        ,
        add= function(key, value){
            log("adding key: " + key);
            db[key]  = value;
        },
        take = function(key){
            return db[key];
        },
        remove = function(key){
            db[key] = null;
        };

    // Public API here
    return {
        db: function(){return db;},
        take: take,
        add: add,
        remove: remove
    };
}]);