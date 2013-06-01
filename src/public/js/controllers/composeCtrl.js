//angular.module('App')
app.controller('ComposeCtrl', ['$scope', 'blockui', '$http', '$location','$timeout','account','groupDb',
    function($scope, blockui, $http, $location,$timeout, account,groupDb){

        // public var
         $scope.compose = {
             data :"",
             GroupId:"",
             userId:account.user(),
             image: ""

         };

        groupDb.getGroups(account.user()._id, function(groupsResult){
            if (groupsResult != null){
                $scope.groups = groupsResult;
            } else {
                $scope.isNoGroups = true;
            }
        });



        $scope.makeCompose = function(){
            log("compose is: ");
            log($scope.compose);

            blockui.block();

            $http.post('/addpost',$scope.compose)
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
        $scope.account = account;

    }]);
