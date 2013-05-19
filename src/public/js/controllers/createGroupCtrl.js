
angular.module('App').controller('CreateGroupCtrl', ['$scope', 'blockui', '$http', '$location','account',
    function($scope, blockui, $http, $location, account){

        // public var
        $scope.isShowError = false;
        $scope.errorInDataBaseSaving = false;
        $scope.Group = {
            name     :"",
            address  : 		{ country:"",
                              city: "",
                              street: "",
                              house:"",
                              apartment: "" },
            image    : ""
        };


        $scope.tempImage="";
        // public functions
        $scope.groupcreator = function() {

            log("group name test: " + $scope.Group);
            log($scope.Group);
            log($scope.Group.address);
            log("-------Image test------");
            log($scope.tempImage);
            blockui.block();

            $http.post('/creategroup',$scope.Group)
                .error(function(data, status, headers, config){

                    httpErrorCallback(data, status, headers, config);
                    blockui.unblock();
                })
                .success(function(data, status, headers, config) {
                    log(data);
                    if (data != null && !data.result)
                    {

                            if(data.msg == "groupExist")
                            {
                                $scope.isShowError = true;
                            }
                            if(data.msg == "groupNotSavedToDB")
                            {
                                $scope.errorInDataBaseSaving = true;
                            }

                            blockui.unblock();

                    }

                   else  if (data != null && data.result){ //case valid
                        blockui.unblock();
                        $scope.isShowError = false;

                        $location.path('/home');
                    } else { //case invalid
                        blockui.unblock();

                        //check for error
                    }
                });
        };
        $scope.logout = account.logout;


    }]);
