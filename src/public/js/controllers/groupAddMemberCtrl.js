"use strict";

app.controller('GroupAddMemberCtrl', ['$scope', 'blockui', '$location', 'account', '$routeParams','$timeout', 'groupDb', '$http',
    function($scope, blockui, $location, account, $routeParams, $timeout, groupDb, $http){

        $scope.isGroupAdmin = false;
        $scope.groupName = $routeParams.groupName;

        groupDb.getGroup($routeParams.groupName, function(g){
            if (g != null){

                $scope.group = g;

                getIsGroupAdmin(account.user()._id, $scope.group._id);
            } else {
                $location.path("/home");
            }
        });

        $scope.newMember = {
            name: ""
        };

        $scope.getUsers = function(value){
            log("getUsers for val:", value);

            return $http.post("/searchusers", { filter: value }).then(function(response){
                    $scope.members = response.data.data;
                },
                function(error){
                    log("error", error);
                    return [];
                }
            );

        };

        $scope.addMember = function(member, groupId){
            groupDb.addMember(member._id, groupId, function(result){
                log("add member result: ", result);
                if (result){
                    history.back();
                } else {
                    $scope.isShowError = true;
                }
            });
        }

        function getIsGroupAdmin(userId, groupId) {
            groupDb.isGroupAdmin(userId, groupId, function(isAdminResult){
                if (isAdminResult != null) {
                    $scope.isGroupAdmin = isAdminResult;
                }
            });
        }

        $scope.account = account;
    }
]);

