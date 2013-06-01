"use strict";

angular.module('App').controller('GroupSettingsCtrl', ['$scope', 'blockui', '$location', 'account', '$routeParams','$timeout', 'groupDb',
    function($scope, blockui, $location, account, $routeParams, $timeout, groupDb){

        log($routeParams.groupName);
        $scope.isGroupAdmin = false;
        $scope.group = {};
        $scope.imageUploadSettings = {
            stage: "posts",
            groupId: "123"
        };

        groupDb.getGroup($routeParams.groupName, function(g){
            if (g != null){
                $scope.group = g;

                groupDb.isGroupAdmin(account.user()._id, $scope.group._id, function(isAdminResult){
                    log("is admin res: ", isAdminResult);
                    if (isAdminResult != null) {
                        $scope.isGroupAdmin = isAdminResult;
                    }
                });

                $scope.imageUploadSettings.groupId = $scope.group._id;
                addAddressString($scope.group); //for use in google map
                addMembers($scope.group);

            } else {
                $location.path("/home");
            }
        });

        //todo temporary
        function addMembers(group){
            group.members = [
                MemberModel(1, 'oryan mishali', false),
                MemberModel(2, 'oryan 2', true),
                MemberModel(3, 'oryan 3', false),
                MemberModel(4, 'oryan ssdfsdf', false)
            ];
        }
        function MemberModel(id, name, isAdmin){
            return {
                user: name,
                id: id,
                isAdmin: isAdmin
            };
        }

        function addAddressString(group){
            if (group != undefined && group != null && group.address != null){
                group.addressString =  group.address.street + " " + group.address.house + ", "
                                            + group.address.city + ", " + group.address.country;
            } else {
                group.addressString = "";
            }
        }

        $scope.account = account;
    }
]);