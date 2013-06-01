"use strict";

app.factory('groupDb', ['$http', function($http){
    // Public API here
    return {
        getGroup: function(groupName, callback){
            $http.post('/getgroupbyname', { name: groupName })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    callback(null);
                })
                .success(function(data, status, headers, config) {
                    callback(data.data);
                });
        },
        getGroupPreview: function(groupName, callback){
            $http.post('/getgrouppreview', { name: groupName })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    callback(null);
                })
                .success(function(data, status, headers, config) {
                    callback(data.data);
                });
        },
        getGroups: function(userId, callback){
            $http.post('/getgroups', { userID: userId })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    callback(null);
                })
                .success(function(data, status, headers, config) {
                    log("get groups: ", data);
                    if (data.result && angular.isArray(data.data)){
                        callback(data.data);
                    } else {
                        callback(null);
                    }
                });
        }
    };
}]);
