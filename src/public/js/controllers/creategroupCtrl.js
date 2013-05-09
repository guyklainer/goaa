
angular.module('App').controller('creategroupCtrl', ['$scope', 'blockui', '$http', '$location','account',
    function($scope, blockui, $http, $location, account){


        var Group = {
            name     :"",
            address  : 		{ country:"",
                              city: "",
                              street: "",
                              house:"",
                              apartment: "" },
            image    : ""
        };



        // public var
        $scope.Group = Group;


        var login = function() {

            log("group name test: " + Group);
            log(Group);
            log(Group.address);

            blockui.block();

            $http.post('/creategroup', Group)
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    $scope.submitFailed = true;
                    blockui.unblock();
                })
                .success(function(data, status, headers, config) {
                    log(data);
                    if (data != null && data.result){
                        blockui.unblock();
                        $scope.submitFailed = false;
                        $location.path('/home');
                    }
                });
        };

        // public functions
        $scope.test = function(){
            log("test");
            blockui.block();
        };
        $scope.login = login;
        $scope.logout = account.logout;


    }]);
