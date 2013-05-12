
angular.module('App').controller('CreateGroupCtrl', ['$scope', 'blockui', '$http', '$location','account',
    function($scope, blockui, $http, $location, account){

        // public var
        $scope.isShowError = false;
        $scope.Group = {
            name     :"",
            address  : 		{ country:"",
                              city: "",
                              street: "",
                              house:"",
                              apartment: "" },
            image    : ""
        };



        // public functions
        $scope.groupcreator = function() {

            log("group name test: " + $scope.Group);
            log($scope.Group);
            log($scope.Group.address);

            blockui.block();

            $http.post('/creategroup', $scope.Group)
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    $scope.submitFailed = true;
                    blockui.unblock();
                })
                .success(function(data, status, headers, config) {
                    log(data);
                    if (data != null && data.result){ //case valid
                        blockui.unblock();
                        $scope.submitFailed = false;
                        $location.path('/home');
                    } else { //case invalid
                        blockui.unblock();

                        //check for error
                    }
                });
        };
        $scope.logout = account.logout;


    }]);
