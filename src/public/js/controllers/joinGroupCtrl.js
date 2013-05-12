
angular.module('App').controller('JoinGroupCtrl', ['$scope', 'blockui', '$http', '$location', 'account', '$cookies', 'db',
    function($scope, blockui, $http, $location, account, $cookies, db){

    // public var
    $scope.query = "";
    $scope.groups = [];


    //public functions
    $scope.search = function(){
        log("search for: " + $scope.query);

        db.add('groupsSearchQuery', $scope.query);

        $http.post('/searchgroups', { groupName: $scope.query })
            .error(function(data, status, headers, config){
                httpErrorCallback(data, status, headers, config);
            })
            .success(function(data, status, headers, config) {
                log(data);
                if (data.result && angular.isArray(data.data)){
                    $scope.groups = data.data;
                    db.add('groupsSearch', $scope.groups);
                }
            });
    };

    $scope.goToPreview = function(group){
        log("group preview");
        log(group);
        db.add('group', group);

        $location.path("/groupPreview");
    }


}]);
