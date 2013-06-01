
angular.module('App').controller('GroupPreviewCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$routeParams', 'groupDb', '$timeout',
    function($scope, blockui, $http, $location, account, $routeParams, groupDb, $timeout){

        log("groupName:", $routeParams.groupName);

        groupDb.getGroupPreview($routeParams.groupName,
            function(g){
                if (g != null){
                    $scope.group = g;
                    addAddressString($scope.group);
                } else {
                    $location.path("/");
                }
            }
        );

        function addAddressString(group){
            if (group != undefined && group != null && group.address != null){
                group.addressString =  group.address.street + " " + group.address.house + ", "
                    + group.address.city + ", " + group.address.country;
            } else {
                group.addressString = "";
            }
        }

        $scope.account = account;
    }]);
