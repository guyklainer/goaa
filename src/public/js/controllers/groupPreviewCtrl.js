
angular.module('App').controller('GroupPreviewCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$routeParams', 'groupDb', '$timeout',
    function($scope, blockui, $http, $location, account, $routeParams, groupDb, $timeout){

        log("groupName:", $routeParams.groupName);

        $scope.joinDisabledEnabledClass = 'disabled';

        groupDb.getGroupPreview($routeParams.groupName,
            function(g){
                if (g != null){
                    $scope.group = g;
                    addAddressString($scope.group);
                    getIsUserInGroup(account.user()._id, $scope.group._id);
                } else {
                    $location.path("/");
                }
            }
        );

        $scope.joinGroup = function(group, userId){

            if ($scope.joinDisabledEnabledClass == ''){
                log("inside");
                groupDb.joinGroup(userId, group._id, function(result){
                    if (result != null && result.result){
                        $location.path('/home');
                    } else {
                        $scope.errorMsg = "Could not join this group";
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
                $scope.joinDisabledEnabledClass = result ? 'disabled' : '';
            });
        }

        $scope.account = account;
    }]);
