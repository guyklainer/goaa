
angular.module('App').controller('TestCtrl', ['$scope', '$http', '$location', 'account',
    function($scope, $http, $location, account){

        $scope.res = "no result yet.."
        $scope.postTest = function(){

            var params = {
                name     : 		    'group4',
                createdOn: 		    new Date(),
                address  : 		    { country: "IL", city: "TA", Street: "ST", House: 1, Apartment: 2 },
                image    :          "/img/logo.png",
                username :          "guyklainer",
                password :          "12",
                confirm_password:   "12",
                token:              "ea5f4ffca70e8cc5fbebe1c2cd9b4fe4af8819138397183e9441cd30c7d87f2bc9bc4a200447ecdda87f2707ce2b7714",
                groupID :           "518fa9d5fd5abcbcf0000001",
                userID  :           "51757326888e1eb90f000004",
                data:               "Whats Upppppp",
                postID:             "9cedf2a2d285783cc92b4670ef3de10148bb88d93aef490d8f5e93f1e00cb5a6c93f6f9599e7c14e7c5b8ee5081e7f881369571711593",
                todoID:             "d579c1c1a3ac03aaa5f0b3961aa0ab5393f8eac739d386f25476a9a085c9ce2025a8f7824f5c7441fecc03869949395c1369566273625"
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


