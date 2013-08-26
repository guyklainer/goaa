
angular.module('App').controller('GroupPreviewCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$routeParams', 'groupDb', '$timeout',
    function($scope, blockui, $http, $location, account, $routeParams, groupDb, $timeout){

        log("groupName:", $routeParams.groupName);

        $scope.joinDisabledEnabledClass = 'disabled';
        $scope.joinBtnName = "Join";

        function updateGroupPreviewModel() {
            groupDb.getGroupPreview($routeParams.groupName, function (g) {
                    if (g != null) {
                        $scope.group = g;
                        addAddressString($scope.group);
                        getIsUserInGroup(account.user()._id, $scope.group._id);
                    } else {
                        $location.path("/");
                    }
                }
            );
        }

        updateGroupPreviewModel();

        $scope.joinGroup = function(group, userId){

            if ($scope.joinDisabledEnabledClass == ''){
                log("inside");
                groupDb.joinGroup(userId, group._id, function(result){
                    if (result){
                        updateGroupPreviewModel();
                    } else {
                        $scope.errorMsg = "could not join this group";
                    }
                });
            }
        }

        function addAddressString(group){
            if (group != undefined && group != null && group.address != null){
                group.addressString =  group.address.street + " " + group.address.house + ", "
                    + group.address.city + ", " + group.address.country;
            } else {
                group.addressString = "";
            }
        }

        function getIsUserInGroup(userId, groupId) {
            groupDb.isUserInGroup(userId, groupId, function(result){
                log("is user in group: ", result);
                if (result != null){
                    $scope.joinDisabledEnabledClass = result.msg != "notInGroup" ? 'disabled' : '';
                    if (result.msg){
                        if (result.msg.toLocaleLowerCase() == "notapprovedyet"){
                            $scope.joinBtnName = "Waiting For Approval";
                        } else if (result.msg.toLocaleLowerCase() == "allreadyingroup"){
                            $scope.joinBtnName = "Allready In This Group";
                        } else {
                            $scope.joinBtnName = "Join";
                        }
                    }
                }
            });
        }

        $scope.account = account;
    }]);
