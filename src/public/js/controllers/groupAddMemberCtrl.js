"use strict";

app.controller('GroupAddMemberCtrl', ['$scope', 'blockui', '$location', 'account', '$routeParams','$timeout', 'groupDb',
    function($scope, blockui, $location, account, $routeParams, $timeout, groupDb){

        $scope.isGroupAdmin = false;

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

