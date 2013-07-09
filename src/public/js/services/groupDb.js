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
        leaveGroup: function(userId, groupId, callback){
            $http.post('/leavegroup', { user: userId, group: groupId })
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
        editGroup: function(address, image, groupId, callback){
            $http.post('/editgroup',{ address: address, image: image, groupID: groupId })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    if (data != null)
                    {
                        if (data.result){
                            callback(true);
                        } else {
                            callback(false);
                        }
                    } else {
                        callback(false);
                    }
                });
        },
        addMember: function(memberName, groupId, callback){
            callback(false);
//            $http.post('/addmember',{ memberName: memberName, groupId: groupId})
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
        },
        isMeterNameExist: function(meterName, groupId, callback){
            $http.post('/checkmetername',{ name: meterName, groupID: groupId})
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    callback(true);
                })
                .success(function(data, status, headers, config) {
                    if (data != null)
                    {
                        if (data.result){
                            callback(true);
                        } else {
                            callback(false);
                        }
                    } else {
                        callback(true);
                    }
                });
        },
        addMeter: function(meter, groupId, callback){
            $http.post('/addmeter',{ meter: meter, groupID: groupId})
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    if (data != null)
                    {
                        if (data.result){
                            callback(true);
                        } else {
                            callback(false);
                        }
                    } else {
                        callback(false);
                    }
                });
        },
        deleteMeter: function(meterId, groupId, callback){
            callback(true);
//            $http.post('/deletemeter',{ meterId: meterId, groupId: groupId})
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
