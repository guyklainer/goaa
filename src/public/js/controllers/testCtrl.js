
angular.module('App').controller('TestCtrl', ['$scope', '$http', '$location', 'account',
    function($scope, $http, $location, account){

        $scope.res = "no result yet.."
        $scope.postTest = function(){

            var params = {
                name     : 		'group1',
                createdOn: 		new Date(),
                address  : 		{ country: "IL", city: "TA", Street: "ST", House: 1, Apartment: 2 },
                image    :      "http:/blabla"
            };

            $http.post('/creategroup', params)
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                })
                .success(function(data, status, headers, config) {
                    log(data);
                    $scope.res = data;
                });
        };

        $scope.logout = account.logout;
}]);
