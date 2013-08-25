//angular.module('App')
app.controller('CreateGroupCtrl', ['$scope', 'blockui', '$http', '$location','account',
    function($scope, blockui, $http, $location, account){

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

            log("group create is: ");
            log($scope.Group);




            NProgress.start();
            $http.post('/creategroup',$scope.Group)
                .error(function(data, status, headers, config){
                    NProgress.done();
                    httpErrorCallback(data, status, headers, config);
                    //todo show general error
                })
                .success(function(data, status, headers, config) {
                    NProgress.done();
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
                        $scope.isShowError = false;

                        $location.path('/home');
                    } else { //case invalid

                        //check for error
                    }
                });
        };


        $scope.change = function() {
             log("is change");

            var param = {
                name: $scope.Group.name
            };

            $http.post('/isgroupexist',param)
                .error(function(data, status, headers, config){
                    httpErrorCallback(data, status, headers, config);

                    //todo show general error
                })
                .success(function(data, status, headers, config) {
                    log(data);

                   if (data != null && !data.result){ //case failed
                        if(data.result == false) {
                            $scope.isShowError = true;
                            $scope.errorMsg="Group already exist";
                       }
                   } else  if (data != null && data.result){ //case success
                         $scope.isShowError = false;
                   } else { //case invalid
                        //check for error
                   }
                });

        };


        $scope.account = account;

    }]);
