//angular.module('App')
app.controller('CreateGroupCtrl', ['$scope', 'blockui', '$http', '$location','account',
    function($scope, blockui, $http, $location, account){

        // public var
        $scope.isShowError = false;
        $scope.errorInDataBaseSaving = false;
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
        $scope.imageUploadSettings = {
            stage: "newGroup"
        };

        // temporary: example for usage of posts
        //
        //$scope.imageUploadSettings = {
        //    stage: "posts",
        //    groupId: "123123"
        //};

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
                        }
                        if(data.msg == "groupNotSavedToDB")
                        {
                            $scope.errorInDataBaseSaving = true;
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

        $scope.account = account;

    }]);
