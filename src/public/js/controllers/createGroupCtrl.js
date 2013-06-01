//angular.module('App')
app.controller('CreateGroupCtrl', ['$scope', 'blockui', '$http', '$location','$timeout','account',
    function($scope, blockui, $http, $location,$timeout, account){

        // public var
        $scope.isShowError = false;
        $scope.errorInDataBaseSaving = false;
        $scope.errorMsg = "";
        $scope.Group = {
            name     : "",
            address  : {
                country: "",
                street: "",
                city: "",
                house: "",
                apartment: ""
            },
            image: ""

        };

        // public functions
        $scope.groupcreator = function() {

            log("group is: ");
            log($scope.Group);

            blockui.block();

            $http.post('/creategroup',$scope.Group)
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);
                    blockui.unblock();
                    //todo show general error
                })
                .success(function(data, status, headers, config) {
                    log(data);
                    if (data != null && !data.result) //case failed
                    {
                        if(data.msg == "groupExist")
                        {
                            $scope.isShowError = true;
                            $scope.errorMsg="Group already exist";
                        }
                        if(data.msg == "groupNotSavedToDB")
                        {
                            $scope.isShowError = true;
                            $scope.errorMsg="We have a problem try again leter";
                        }

                        blockui.unblock();

                    } else  if (data != null && data.result){ //case success
                        blockui.unblock();
                        $scope.isShowError = false;

                        $location.path('/home');
                    } else { //case invalid
                        blockui.unblock();

                        //check for error
                    }
                });
        };



        $scope.change = function() {

            $http.post('/isgroupexist',$scope.Group)
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);

                    //todo show general error
                })
                .success(function(data, status, headers, config) {
                    log(data);

                    if (data != null && !data.result) //case failed
                    {
                        if(data.msg == "groupExist")
                        {
                            $scope.isShowError = true;
                            $scope.errorMsg="Group already exist";
                        }
                        if(data.msg == "groupNotSavedToDB")
                        {
                            $scope.isShowError = true;
                            $scope.errorMsg="We have a problem try again leter";
                        }

                    } else  if (data != null && data.result){ //case success
                        blockui.unblock();
                        $scope.isShowError = false;

                        $location.path('/home');
                    } else { //case invalid
                        blockui.unblock();
                        //check for error
                    }
                });

        };


        $scope.account = account;

    }]);
