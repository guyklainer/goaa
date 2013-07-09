
angular.module('App').controller('GroupToDosCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$cookies', 'groupDb','$routeParams',
    function($scope, blockui, $http, $location, account, $cookies,groupDb,$routeParams){

         $scope.editTodos="";
        groupDb.getGroup($routeParams.groupName, function(g){
            log("getGroup result: ", g);
            $scope.isLoading = false;
            $scope.group = g;
            log("todos:",$scope.group);
        });
         $scope.errorMsg="";
        $scope.isShowError=false;

            $scope.addTodo = function() {
                if($scope.todoText)
                {
                    log("$scope.todoText")
                    groupDb.addTodoItem($scope.todoText, $scope.group._id,account.user()._id, function(result){
                        if(result)
                        {

                            log("todo item:",$scope.todoText)
                            $scope.group.todos.push({data:$scope.todoText, isDone:false});
                            // $scope.todoText = '';
                        }
                    } );
                }
                else
                {
                    $scope.errorMsg="you must eneter todo's discrption";
                    $scope.isShowError=true;
                }




                };


            $scope.remaining = function() {
                var count = 0;
                angular.forEach($scope.todos, function(todo) {
                    count += todo.done ? 0 : 1;
                });
                return count;
            };

            $scope.archive = function() {
                var oldTodos = $scope.todos;
                $scope.todos = [];
                angular.forEach(oldTodos, function(todo) {
                    if (!todo.done) $scope.todos.push(todo);
                });
            };
        $scope.clearDoneItem=function(){
            $scope.todos= _.filter($scope.todos,function(todo){
            return !todo.done;
            })
        };

        $scope.showEditText = function(todo){
            if(todo.edit==false)
            {
                todo.edit=true;
            }
            else
            {
                todo.edit=false;
            }

        };



        // public functions

        $scope.account = account;
    }]);
