
angular.module('App').controller('GroupPreviewCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$routeParams', 'groupDb', '$timeout',
    function($scope, blockui, $http, $location, account, $routeParams, groupDb, $timeout){

        log("groupName:", $routeParams.groupName);

        $scope.joinDisabledEnabledClass = 'disabled';

        groupDb.getGroupPreview($routeParams.groupName,
            function(g){
                log("group preview res:" , g);
                if (g != null){
                    $scope.group = g;
                    addAddressString($scope.group);
                    getIsUserInGroup(account.user()._id, $scope.group.id);
                } else {
                    log("group is null");
                    $location.path("/");
                }
            }
        );

        $scope.joinGroup = function(group, userId){

            if ($scope.joinDisabledEnabledClass == ''){
                log("inside");
                groupDb.joinGroup(userId, group.id, function(result){
                    if (result != null){
                        $location.path('/home');
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
                $scope.joinDisabledEnabledClass = result ? 'disabled' : '';
            });
        }

        $scope.account = account;
    }]);
