"use strict";

angular.module('App').controller('GroupCtrl', ['$scope', '$location', 'account', '$routeParams','$timeout', 'groupDb', 'contextService',
    function($scope, $location, account, $routeParams, $timeout, groupDb, contextService) {

//        socket.on( "new-post", function(data){
//            if( account.user()._id != data.userID && $scope.view != $scope.partialEnum.news ){
//                $scope.newPosts++;
//            }
//            $scope.group.posts.unshift( data );
//        });
//
//        socket.on( "new-todo", function(data){
//            if( account.user()._id != data.userID && $scope.view != $scope.partialEnum.todos ){
//                $scope.newTodos++;
//            }
//            $scope.group.todos.push( data );
//        });

        $scope.newPosts         = 0;
        $scope.newTodos         = 0;
        $scope.showSettings     = true;
        $scope.groupPage        = true;
        $scope.isLoading        = true;
        $scope.isNoMeters       = false;
        $scope.groupName        = $routeParams.groupName;
        $scope.errorMsg         = "";
        $scope.user             = account.user();
        $scope.newTodo          = {
            data: ""
        };
        $scope.numberOfUsersWaiting = 0;

        $scope.partialEnum      = {
            gallery : 'gallery',
            meters  : 'meters',
            todos   : 'todos',
            news    : 'news'
        };

        $scope.view = $scope.partialEnum.news;

        function updateNumberOfUsersWaiting(group) {
            $scope.numberOfUsersWaiting = 0;
            _.each(group.members, function(member){
                if (!member.approved){
                    $scope.numberOfUsersWaiting += 1;
                }
            });
        }

        function loadGroup() {
            groupDb.getGroup($routeParams.groupName, function(g){
                log("getGroup result: ", g);
                $scope.isLoading = false;
                $scope.group = g;
                contextService.group.val = g;
                updateNumberOfUsersWaiting($scope.group);
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
            if( view == $scope.partialEnum.news )
                $scope.newPosts = 0;

            if( view == $scope.partialEnum.todos )
                $scope.newTodos = 0;

            $scope.view = view;

            //binding the hide bottom bar event
            $timeout(function(){
                $scope.$broadcast('event:hideBottom');
            },1000);
        }

        $scope.addTodo = function(isValid) {
            if (isValid){
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

        $scope.removePost = function(post){
            log("deleting post", todoItem);

            groupDb.deletePost(post, $scope.group._id, function(result){
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

