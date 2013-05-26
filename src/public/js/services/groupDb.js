"use strict";

app.factory('groupDb', ['$http', '$location', function($http, $location){
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
        }
    };
}]);
