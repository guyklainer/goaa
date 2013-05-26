"use strict";

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