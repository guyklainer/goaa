
angular.module('App').controller('JoinGroupCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$cookies',
    function($scope, blockui, $http, $location, account, $cookies){

    // public var
    $scope.query = "";
    $scope.groups = [
        {name: "group1", address:{}},
        {name: "group2", address:{}},
        {name: "group3", address:{}},
        {name: "test1", address:{}},
        {name: "test2", address:{}}
    ];


    //public functions
    $scope.search = function(){
        log("search for: " + $scope.query);
        $http.post('/searchgroups', { groupName: $scope.query })
            .error(function(data, status, headers, config){
                httpErrorCallback(data, status, headers, config);
            })
            .success(function(data, status, headers, config) {
                log(data);
                if (data.result && angular.isArray(data.data)){
                    $scope.groups = data.data;
                }
            });
    };

    $scope.getToPreview(group)
    {
        $location.path("/groupPreview");
    }




}]);
