//angular.module('App')
app.controller('ComposeCtrl', ['$scope', 'blockui', '$http', '$location','$timeout','account','groupDb','$routeParams',
    function($scope, blockui, $http, $location,$timeout, account,groupDb,$routeParams){

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
                _.each($scope.groups, function(group){
                    if($routeParams.groupName)
                    {
                        if($routeParams.groupName == group.name )
                        {
                            $scope.compose.groupID = group._id;
                        }
                    }
                });
            } else {
                $scope.isNoGroups = true;
            }
        });

        log("params:")
        log($routeParams.groupName)

        $timeout(function(){
            log("time", $scope.compose);
        },4000);

        if($routeParams.groupName)   //params is define
        {
            groupDb.getGroup($routeParams.groupName, function(g){
                log("getGroup result: ", g);
                $scope.isLoading = false;
                $scope.group = g;
            });
        }

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

            if($scope.compose.groupID=="" /*&& !$routeParams.groupName*/)
            {
                $scope.isShowError = true;
                $scope.errorMsg="You must choose a group";
               // $timeout(function(){blockui.unblock()},200)     ;

            }
            else if($scope.compose.data=="" && $scope.compose.image=="")
            {
                $scope.isShowError = true;
                $scope.errorMsg="You must fill in post or image";
               // $timeout(function(){blockui.unblock()},200)
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

    }}

         $scope.selectedMsg="";
        // ng-selected="isSelected(group)"
        $scope.isSelected = function(group){

              if($routeParams.groupName)
               {
                   if($routeParams.groupName == group.name )
                   {
                       //$scope.compose.groupID = group._id;
                       log("show compose",$scope.compose) ;
                       return true;
                   }
                   else
                   {
                       return false;
                   }

               }


            $scope.account = account;
        }

    }

    ]);
