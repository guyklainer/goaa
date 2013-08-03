"use strict";

angular.module('App').controller('GroupCtrl', ['$scope', 'blockui', '$location', 'account', '$routeParams','$timeout', 'groupDb',
    function($scope, blockui, $location, account, $routeParams, $timeout, groupDb){

        $scope.showSettings     = true;
        $scope.groupPage        = true;
        $scope.isLoading        = true;
        $scope.isNoMeters       = false;
        $scope.groupName        = $routeParams.groupName;
        $scope.errorMsg         = "";
        $scope.newTodo          = {
            data: ""
        };
        $scope.partialEnum      = {
            gallery : 'gallery',
            meters  : 'meters',
            todos   : 'todos',
            news   : 'news'
        };
        $scope.view             = $scope.partialEnum.news;

        function loadGroup() {
            groupDb.getGroup($routeParams.groupName, function(g){
                log("getGroup result: ", g);
                $scope.isLoading = false;
                $scope.group = g;
            });
        }
        function showTodoItemErrorMsg(todoItem, doneCallback) {
            todoItem.ErrorMsg = "oops we have a problem..";

            $timeout(function () {
                todoItem.ErrorMsg = "";
                if (doneCallback){
                    doneCallback();
                }
            }, 2000);
        }

        function parseForDb(todoItem) {
            var dbItem = {
                _id: todoItem._id,
                userID: todoItem.userID,
                username: todoItem.username,
                data: todoItem.data,
                isDone: todoItem.isDone,
                createdOn: todoItem.createdOn
            };
            return dbItem;
        }
        loadGroup();

        $scope.isShowNoNews = function(posts, isLoading){
            if (isLoading){
                return false;
            } else {
                return posts == undefined || posts == null || posts.length == 0;
            }
        }
        $scope.isShowNoPhotos = function(posts, isLoading){
            if (isLoading){
                return false;
            } else {
                return posts == undefined || posts == null || getPhotosCount(posts) == 0;
            }
        }
        function getPhotosCount(posts){
            return _.filter(posts,
                function(post){
                    return post.image && post.image != "";
                }).length;
        }
        $scope.isShowNoMeters = function(meters, isLoading){
            if (isLoading){
                return false;
            } else {
                return meters == undefined || meters == null || meters.length == 0;
            }
        }


        var len = 200;
        $scope.toShortStr = function(message){
            var str = message;

            if (message && message.length > len){
                str = message.substr(0,len) + "...";
            }

            return str;
        }
        $scope.toggleTextLength = function(post){
            post.isShowFull = !post.isShowFull;
        }
        $scope.isTooBigMessage = function(message){
            var result = false;

            if (message && message.length > len){
                result = true;
            }

            return result;
        }
        $scope.gotoMeter = function(meter){
            log("meter : ", meter);
            $location.path($location.path() + '/meters/' + meter.name);
        }
        $scope.gotoGroupSettings = function(){
            $location.path('group/' + $routeParams.groupName + '/settings');
        }
        $scope.gotoComposePost = function(){
            $location.path("compose/" + $scope.groupName);
        }
        $scope.switchView = function(view){
            $scope.view = view;
        }

        $scope.addTodo = function() {
            //clearing the error msg
            $scope.errorMsg = "";
            if($scope.newTodo.data) {

                groupDb.addTodoItem($scope.newTodo.data,
                    $scope.group._id,
                    account.user()._id,
                    account.user().firstName + ' ' + account.user().lastName,
                    function(result){

                        if(result) {
                            $scope.isLoading = true;
                            $scope.newTodo.data = "";
                            loadGroup();
                        } else {
                            //error adding the new item
                            $scope.errorMsg = "oops, could not save it";
                        }

                    } );
            } else {
                $scope.errorMsg = "enter something todo...";
            }
        };

        $scope.editTodo = function(todoItem){
            log("edit todoItem", todoItem);
            if (todoItem.data){
                groupDb.updateTodoItem(parseForDb(todoItem), $scope.group._id, function(result){
                    if (result){
                        todoItem.isEdit = false;
                    } else {
                        showTodoItemErrorMsg(todoItem, function(){
                            loadGroup();
                        });
                    }
                });
            } else {
                showTodoItemErrorMsg(todoItem);
            }
        };

        $scope.markDone = function(todoItem){
            log("marking as done", todoItem);

            groupDb.updateTodoItem(parseForDb(todoItem), $scope.group._id, function(result){
                if (!result){ //case error

                    todoItem.isDone = !todoItem.isDone;
                    showTodoItemErrorMsg(todoItem);
                }
            });
        };

        $scope.deleteTodo = function(todoItem){
            log("deleting todoItem", todoItem);

            groupDb.deleteTodoItem(todoItem._id, $scope.group._id, function(result){
                if (result){
                    loadGroup();
                } else {
                    showTodoItemErrorMsg(todoItem);
                }
            });
        };

        $scope.account = account;
    }
]);

