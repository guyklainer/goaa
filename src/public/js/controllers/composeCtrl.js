//angular.module('App')
app.controller('ComposeCtrl', ['$scope', 'blockui', '$http', '$location','$timeout','account','groupDb',
    function($scope, blockui, $http, $location,$timeout, account,groupDb){

        // public var
         $scope.compose = {
             data :"",
             groupID:"",
             userID:account.user()._id,
             image: ""

         };
         $scope.groupNotSelectedErr=true;
        $scope.errorMsg="";
        groupDb.getGroups(account.user()._id, function(groupsResult){
            if (groupsResult != null){
                $scope.groups = groupsResult;
            } else {
                $scope.isNoGroups = true;
            }
        });

        $scope.imageUploadSettings = {
            stage: "posts",
            groupId:  ""
        };

        $scope.makeCompose = function(){
           $scope.imageUploadSettings.groupId=  $scope.compose.groupID;
            log("compose is: ");
            log($scope.compose);
            log("image details: ");
            log($scope.imageUploadSettings);

           blockui.block();

            if($scope.compose.groupID=="")
            {
                $scope.isShowError = true;
                $scope.errorMsg="You must choose a group";
                $timeout(function(){blockui.unblock()},200)     ;

            }
            else if($scope.compose.data=="" && $scope.compose.image=="")
            {
                $scope.isShowError = true;
                $scope.errorMsg="You must fill in post or image";
                $timeout(function(){blockui.unblock()},200)
            }
            else
            {


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
                        if(data.result == false)
                        {
                            $scope.isShowError = true;
                            blockui.unblock();
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

        $scope.account = account;

    }}}]);
