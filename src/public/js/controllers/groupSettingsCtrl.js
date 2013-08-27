"use strict";

angular.module('App').controller('GroupSettingsCtrl', ['$scope', '$location', 'account', '$routeParams','$timeout', 'groupDb',
    function($scope, $location, account, $routeParams, $timeout, groupDb){

        function getGroup() {
            groupDb.getGroup($routeParams.groupName, function (g) {
                if (g != null) {

                    $scope.group = g;

                    getIsGroupAdmin(account.user()._id, $scope.group._id);
                    updateMemberIsApprovedField($scope.group);
                    addAddressString($scope.group); //for use in google map
                    updateNumberOfUsersWaiting($scope.group);
                } else {
                    $location.path("/home");
                }
            });
        }

        $scope.inSettings   = true;
        $scope.isGroupAdmin = false;
        $scope.tabs         = ['General', 'Members', 'Meters'];
        $scope.tab          = $scope.tabs[0];

        $scope.gotoTab = function(tab){
            $scope.tab = tab;
        }

        $scope.imageUploadSettings = {
            stage: "newGroup"
        };

        getGroup();

        $scope.isAdmin = function(member){
            return $scope.group.adminID == member.user._id;
        };

        $scope.confirmMember = function(member, groupId){
            log("confirm member", member);
            NProgress.start();
            groupDb.confirmMember(member.user._id, groupId,
                function(result){
                    NProgress.done();
                    log("confirm result:", result);
                    if (result){
                        member.approved = result;
                        updateNumberOfUsersWaiting($scope.group);
                    }
            });
        };

        $scope.deleteMember = function(member, groupId){
            log("delete member", member);
            NProgress.start();
            groupDb.leaveGroup(member.user._id, groupId,
                function(result){
                    NProgress.done();
                    log("delete result:", result, typeof result);
                    if (result){
                        //refresh the list
                        getGroup();
                    }
                });
        };

        $scope.gotoAddMember = function(){
            $location.path($location.path() + "/addMember");
        };

        $scope.gotoMeter = function(meterId){
            log('gotometer', $location.path() + "/meter");
            if (meterId){
                $location.path($location.path() + "/meter/" + meterId);
            } else {
                $location.path($location.path() + "/meter");
            }
        };

        $scope.deleteMeter = function(meter, groupId){
            NProgress.start();
            groupDb.deleteMeter(meter._id, groupId, function(result){
                NProgress.done();
                log("delete meter result: ", result);
                if (result){
                    $scope.group.meters = _.without($scope.group.meters, meter);
                } else {
                    meter.isDeleteError = true;
                }
            });
        };

        $scope.leaveGroup = function(group){
            log("leaveGroup: ", group);
            NProgress.start();
            groupDb.leaveGroup(account.user()._id, group._id, function(result){
                NProgress.done();
                log("leave group result:", result);
                if (result){
                    $location.path("/home");
                }
            });
        };

        $scope.saveChanges = function(group){
            log("group save", group);
            NProgress.start();
            groupDb.editGroup(group.address, group.image, group._id, function(result){
                NProgress.done();
                log("edit group result:", result);
                if (result){
                    //case success -> go to the group screen
                    var lengthUntilSettings = $location.path().indexOf('/settings');
                    var newUrl = $location.path().substr(0, lengthUntilSettings);
                    log(newUrl);
                    $location.path(newUrl);
                } else {
                    $scope.isSaveError = true;
                }
            });
        }

        function updateNumberOfUsersWaiting(group) {
            $scope.numberOfUsersWaiting = 0;
            _.each(group.members, function(member){
                if (!member.approved){
                    $scope.numberOfUsersWaiting += 1;
                }
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