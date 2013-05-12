
angular.module('App').controller('creategroupCtrl', ['$scope', 'blockui', '$http', '$location','account',
    function($scope, blockui, $http, $location, account){


        var Group = {
            name     :"",
            address  : 		{ country:"",
                              city: "",
                              street: "",
                              house:"",
                              apartment: "" },
            image    : "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSjceMBd_6u6JAr5bLlXoVEfxf1yDGiipG7Ryo55ILSvdvwhj8XAQ"
        };



        // public var
        $scope.Group = Group;


        var groupcreator = function() {

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
        $scope.groupcreator = groupcreator;
        $scope.logout = account.logout;


    }]);
