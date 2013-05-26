
angular.module('App').controller('HomeCtrl', ['$scope', 'blockui', '$http', '$location', 'account',
    function($scope, blockui, $http, $location, account){

    // public var
    $scope.isNoGroups = false;
    $scope.groups = [];

    $http.post('/getgroups', { userID: account.user()._id })
        .error(function(data, status, headers, config){
            httpErrorCallback(data, status, headers, config);
        })
        .success(function(data, status, headers, config) {
            log("get groups: ", data);
            if (data.result && angular.isArray(data.data)){
                $scope.groups = data.data;
                $scope.isNoGroups = $scope.groups.length == 0;
            } else{
                $scope.isNoGroups = true;
            }
        });

    // public functions
    $scope.gotoCreateGroup = function(){
        $location.path("/createGroup");
    };

    $scope.gotoJoinGroup = function(){
        $location.path("/joinGroup");
    };

    $scope.gotoComposePost = function(){
        $location.path("/composePost");
    };

    $scope.moveToGroup = function(group){
        log("group",group);
        $location.path("/group/" + group._id);
    };
    $scope.account = account;
}]);
