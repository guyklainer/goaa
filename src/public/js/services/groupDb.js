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
        },
        isGroupAdmin: function(userId, groupId, callback){
            $http.post('/isgroupadmin', { user: userId, group: groupId })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    if (data != null){
                        callback(data.result);
                    } else {
                        callback(false);
                    }
                });
        },
        isUserInGroup: function(userId, groupId, callback){
            $http.post('/isuseringroup', { user: userId, group: groupId })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    callback(null);
                })
                .success(function(data, status, headers, config) {
                    if (data != null){
                        callback(data);
                    } else {
                        callback(null);
                    }
                });
        },
        joinGroup: function(userId, groupId, callback){
            $http.post('/joingroup', { user: userId, group: groupId })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    if (data != null){
                        callback(data.result);
                    } else {
                        callback(false);
                    }
                });
        },
        confirmMember: function(userId, groupId, callback){
            $http.post('/approveuser', { user: userId, group: groupId })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    if (data != null){
                        callback(data.result);
                    } else {
                        callback(false);
                    }
                });
        },
        leaveGroup: function(groupId, callback){
            callback(false);
//            $http.post('/leavegroup', { group: groupId })
//                .error(function(data, status, headers, config){
//                    httpErrorCallback(data, status, headers, config);
//                    callback(false);
//                })
//                .success(function(data, status, headers, config) {
//                    if (data != null){
//                        callback(data.result);
//                    } else {
//                        callback(false);
//                    }
//                });
        },
        editGroup: function(address, image, callback){
            callback(false);
//            $http.post('/editgroup',{ address: address, image: image})
//                .error(function(data, status, headers, config){
//                    httpErrorCallback(data, status, headers, config);
//                    callback(false);
//                })
//                .success(function(data, status, headers, config) {
//                    if (data != null)
//                    {
//                        if (data.result){
//                            callback(true);
//                        } else {
//                            callback(false);
//                        }
//                    } else {
//                        callback(false);
//                    }
//                });
        }
    };
}]);
