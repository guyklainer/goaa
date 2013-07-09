
angular.module('App').controller('GroupToDosCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$cookies', 'groupDb','$routeParams', '$timeout',
    function($scope, blockui, $http, $location, account, $cookies, groupDb, $routeParams, $timeout){

        $scope.isLoading        = true;
        $scope.view             = 'todos';
        $scope.groupName        = $routeParams.groupName;
        $scope.editTodos        = "";
        $scope.errorMsg         = "";


        function loadGroup() {
            groupDb.getGroup($routeParams.groupName, function (g) {
                log("todos getGroup result: ", g);
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

        loadGroup();


        $scope.addTodo = function() {
            //clearing the error msg
            $scope.errorMsg = "";

            if($scope.todoText) {

                groupDb.addTodoItem($scope.todoText, $scope.group._id, account.user()._id, function(result){

                    if(result) {
                        $scope.isLoading = true;
                        $scope.todoText = "";
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

            groupDb.editTodoItem(todoItem, $scope.group._id, account.user()._id, function(result){
                if (result){
                    todoItem.isEdit = false;
                } else {
                    showTodoItemErrorMsg(todoItem, function(){
                        loadGroup();
                    });
                }
            });
        };

        $scope.markDone = function(todoItem){
            log("marking as done", todoItem);

            groupDb.markTodoItem(todoItem, $scope.group._id, account.user()._id, function(result){
                if (!result){ //case error

                    todoItem.isDone = !todoItem.isDone;
                    showTodoItemErrorMsg(todoItem);
                }
            });
        };

        $scope.deleteTodo = function(todoItem){
            log("deleting todoItem", todoItem);

            groupDb.deleteTodoItem(todoItem, $scope.group._id, account.user()._id, function(result){
                if (result){
                    var index = $scope.group.todos.indexOf(todoItem);
                    $scope.group.todos.splice(index,1);
                } else {
                    showTodoItemErrorMsg(todoItem);
                }
            });
        };

        $scope.account = account;
    }]);
