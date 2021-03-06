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
            log('get group function');
            NProgress.start();
            $http.post('/getgroups', { userID: userId })
                .error(function(data, status, headers, config){
                    NProgress.done();
                    httpErrorCallback(data, status, headers, config);
                    callback(null);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
                    log("get groups: ", data);
                    if (data.result && angular.isArray(data.data)){
                        callback(data.data);
                    } else {
                        callback(null);
                    }
                });
        },
        isGroupAdmin: function(userId, groupId, callback){
            NProgress.start();
            $http.post('/isgroupadmin', { user: userId, group: groupId })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
                    if (data != null){
                        callback(data.result);
                    } else {
                        callback(false);
                    }
                });
        },
        isUserInGroup: function(userId, groupId, callback){
            NProgress.start();
            $http.post('/isuseringroup', { user: userId, group: groupId })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                    callback(null);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
                    if (data != null){
                        callback(data);
                    } else {
                        callback(null);
                    }
                });
        },
        joinGroup: function(userId, groupId, callback){
            NProgress.start();
            $http.post('/joingroup', { user: userId, groupID: groupId })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
                    if (data != null){
                        callback(data.result);
                    } else {
                        callback(false);
                    }
                });
        },
        confirmMember: function(userId, groupId, callback){
            NProgress.start();
            $http.post('/approveuser', { user: userId, group: groupId })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
                    if (data != null){
                        callback(data.result);
                    } else {
                        callback(false);
                    }
                });
        },
        leaveGroup: function(userId, groupId, callback){
            NProgress.start();
            $http.post('/leavegroup', { user: userId, group: groupId })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
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
            NProgress.start();
            $http.post('/editgroup',{ address: address, image: image, groupID: groupId })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
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
        addMember: function(memberId, groupId, callback){
            NProgress.start();
            $http.post('/addmember',{ member: memberId, groupID: groupId})
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
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
            NProgress.start();
            $http.post('/checkmetername',{ name: meterName, groupID: groupId, meterID: meterId})
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                    callback(true);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
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
            NProgress.start();
            $http.post('/addmeter',{ meter: meter, groupID: groupId})
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
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
            NProgress.start();
            $http.post('/removemeter',{ meterID: meterId, groupID: groupId})
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
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
            NProgress.start();
            $http.post('/addtodo', { data: todoItem, groupID: groupId, userID:userId, username: name })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
                    if (data != null){
                        callback(data.result);
                    } else {
                        callback(false);
                    }
                });
        },
        updateTodoItem: function(todoItem, groupId, callback){
            NProgress.start();
            $http.post('/updatetodo', { data: todoItem, groupID: groupId })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
                    if (data != null){
                        callback(data.result);
                    } else {
                        callback(false);
                    }
                });
        },
        deleteTodoItem: function(todoId, groupId, callback){
            NProgress.start();
            callback(true);
            $http.post('/removetodo', { todoID: todoId, groupID: groupId })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
                    if (data != null){
                        callback(data.result);
                    } else {
                        callback(false);
                    }
                });
        },
        removePost: function(post, groupId, callback){
            NProgress.start();
            callback(true);
            $http.post('/removepost', { postID: post, groupID: groupId })
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    NProgress.done();
                    callback(false);
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
                    if (data != null){
                        callback(data.result);
                    } else {
                        callback(false);
                    }
                });
        }
    };
}]);
