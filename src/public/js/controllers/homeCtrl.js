
angular.module('App').controller('HomeCtrl', ['$scope', 'blockui', '$http', '$location', 'account',
    function($scope, blockui, $http, $location, account){

    $http.post('/getgroups', { userID: account.user()._id })
        .error(function(data, status, headers, config){
            httpErrorCallback(data, status, headers, config);
        })
        .success(function(data, status, headers, config) {
            log(data);
            if (data.result && angular.isArray(data.data)){
                $scope.groups = data.data;
            }
        });

    // public var
    $scope.groups = [];

    var gotoCreateGroup = function(){
        $location.path("/createGroup");
    }
    ,
    gotoJoinGroup = function(){
        $location.path("/joinGroup");
    }
    ,
    gotoComposePost = function(){
        $location.path("/composePost");
    };

    // public functions
    $scope.gotoCreateGroup = gotoCreateGroup;
    $scope.gotoJoinGroup = gotoJoinGroup;
    $scope.gotoComposePost = gotoComposePost;
    $scope.account = account;
}]);
