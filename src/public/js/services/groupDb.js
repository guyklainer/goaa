"use strict";

app.factory('groupDb', ['$http', function($http){
    // Public API here
    return {
        getGroup: function(groupName, callback){
            NProgress.start();
            $http.post('/getgroupbyname', { name: groupName })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                    callback(null);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
                    callback(data.data);
                });
        },
        getGroupPreview: function(groupName, callback){
            NProgress.start();
            $http.post('/getgrouppreview', { name: groupName })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                    callback(null);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
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
            $http.post('/addmember',{ member: memberName, groupID: groupId})
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    if (data != null) {
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
        isMeterNameExist: function(meterName, meterId, groupId, callback){
            $http.post('/checkmetername',{ name: meterName, groupID: groupId, meterID: meterId})
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
            $http.post('/removemeter',{ meterID: meterId, groupID: groupId})
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    if (data != null) {
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
        addTodoItem: function(todoItem, groupId, userId, name, callback){
            $http.post('/addtodo', { data: todoItem, groupID: groupId, userID:userId, name: name })
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
        updateTodoItem: function(todoItem, groupId, callback){
            $http.post('/updatetodo', { data: todoItem, groupID: groupId })
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
        deleteTodoItem: function(todoId, groupId, callback){
            callback(true);
            $http.post('/removetodo', { todoID: todoId, groupID: groupId })
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
        }
    };
}]);
