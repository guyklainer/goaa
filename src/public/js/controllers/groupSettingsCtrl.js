"use strict";

angular.module('App').controller('GroupSettingsCtrl', ['$scope', 'blockui', '$location', 'account', '$routeParams','$timeout', 'groupDb',
    function($scope, blockui, $location, account, $routeParams, $timeout, groupDb){

        log($routeParams.groupName);
        $scope.isGroupAdmin = false;

        $scope.imageUploadSettings = {
            stage: "newGroup"
        };

        groupDb.getGroup($routeParams.groupName, function(g){
            if (g != null){

                $scope.group = g;
                $scope.imageUploadSettings.groupId = $scope.group._id;
                getIsGroupAdmin(account.user()._id, $scope.group._id);
                addAddressString($scope.group); //for use in google map
            } else {
                $location.path("/home");
            }
        });

        $scope.isAdmin = function(member){
            log("isAdmin", member);
            return $scope.group.adminID == member._id;
        }
        function addAddressString(group){
            if (group != undefined && group != null && group.address != null){
                group.addressString =  group.address.street + " " + group.address.house + ", "
                                            + group.address.city + ", " + group.address.country;
            } else {
                group.addressString = "";
            }
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