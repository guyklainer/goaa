"use strict";

angular.module('App').controller('GroupSettingsCtrl', ['$scope', 'blockui', '$location', 'account', '$routeParams','$timeout', 'groupDb',
    function($scope, blockui, $location, account, $routeParams, $timeout, groupDb){

        //log($routeParams.groupName);
        $scope.isGroupAdmin = false;
        $scope.tabs = ['General', 'Members', 'Meters'];
        $scope.tab = $routeParams.tab;
        $scope.gotoTab = function(tab){
            var index   = $location.path().indexOf($routeParams.tab),
                url     = $location.path().substr(0, index-1);

            $location.path( url + '/' + tab );
        }

        $scope.imageUploadSettings = {
            stage: "newGroup"
        };

        groupDb.getGroup($routeParams.groupName, function(g){
            if (g != null){

                $scope.group = g;

                getIsGroupAdmin(account.user()._id, $scope.group._id);
                updateMemberIsApprovedField($scope.group);
                $scope.group.meters = [
                    {name:"name1", _id:1},
                    {name:"name2", _id:2},
                    {name:"name3", _id:3}
                ];
                addAddressString($scope.group); //for use in google map
            } else {
                $location.path("/home");
            }
        });

        $scope.isAdmin = function(member){
            return $scope.group.adminID == member._id;
        };

        $scope.confirmMember = function(member, groupId){
            log("confirm member", member);
            blockui.block();
            groupDb.confirmMember(member._id, groupId,
                function(result){
                    blockui.unblock();
                    log("confirm result:", result);
                    if (result){
                        member.isApproved = result;
                    }
            });
        };

        $scope.gotoAddMember = function(){
            $location.path($location.path() + "/addMember");
        };

        $scope.gotoMeter = function(meterId){
            if (meterId){
                $location.path($location.path() + "/meter/" + meterId);
            } else {
                $location.path($location.path() + "/meter");
            }
        };



        $scope.leaveGroup = function(group){
            log("leaveGroup: ", group);
            blockui.block();
            groupDb.leaveGroup(account.user()._id, group._id,
                function(result){
                    blockui.unblock();
                    log("leave group result:", result);
                    if (result){
                        $location.path("/home");
                    }
                });
        };

        $scope.saveChanges = function(group){
            log("group save", group);
            blockui.block();
            groupDb.editGroup(group.address, group.image, group._id, function(result){
                blockui.unblock();
                log("edit group result:", result);
                $scope.isSaveError = !result;
            });
        }

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
                if (!$scope.isGroupAdmin && $scope.tab != 'General'){
                    $location.path("/home");
                }
            });
        }

        $scope.account = account;
    }
]);