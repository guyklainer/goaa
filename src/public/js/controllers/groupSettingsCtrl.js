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

                getIsGroupAdmin(account.user()._id, $scope.group._id);
                updateMemberIsApprovedField($scope.group);

                $scope.group.meters = [
                    {name:"name1"},
                    {name:"name2"},
                    {name:"name3"},
                ];

                addAddressString($scope.group); //for use in google map
            } else {
                $location.path("/home");
            }
        });

        $scope.isAdmin = function(member){
            return $scope.group.adminID == member._id;
        };

        $scope.confirmMember = function(member){
            log("confirm member", member);
            blockui.block();
            groupDb.confirmMember(account.user()._id, member._id, $scope.group._id,
                function(result){
                    blockui.unblock();
                    log("confirm result:", result);
                    if (result){
                        member.isApproved = result;
                    }
            });
        };

        function updateMemberIsApprovedField(group) {
            _.each(group.members, function(member){
                member.isApproved = isApproved(member);
            });
        }
        function isApproved(member){
            var result = true;

            _.each($scope.group.notApproved, function(elem){
                if (elem == member._id){
                    result = false;
                }
            });

            return result;
        };
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