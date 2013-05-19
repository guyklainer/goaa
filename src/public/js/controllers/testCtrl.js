
angular.module('App').controller('TestCtrl', ['$scope', '$http', '$location', 'account',
    function($scope, $http, $location, account){

        $scope.res = "no result yet.."
        $scope.postTest = function(){

            var params = {
                name     : 		    'group4',
                createdOn: 		    new Date(),
                address  : 		    { country: "IL", city: "TA", Street: "ST", House: 1, Apartment: 2 },
                image    :          "http:/blabla",
                username :          "guyklainer",
                password :          "12",
                confirm_password:   "12",
                token:              "ea5f4ffca70e8cc5fbebe1c2cd9b4fe4af8819138397183e9441cd30c7d87f2bc9bc4a200447ecdda87f2707ce2b7714",
                groupID :           "518f92a0a691e1909300000c",
                userID  :           "51757326888e1eb90f000004",
                data:               "hello",
                postID:             111
            };



            $http.post('/addpost', params)
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


