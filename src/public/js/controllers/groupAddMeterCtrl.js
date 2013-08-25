"use strict";

app.controller('GroupAddMeterCtrl', ['$scope', 'blockui', '$location', 'account', '$routeParams','$timeout', 'groupDb',
    function($scope, blockui, $location, account, $routeParams, $timeout, groupDb){

        $scope.isGroupAdmin = false;
        $scope.groupName    = $routeParams.groupName;
        $scope.meterId      = $routeParams.meterId;

        $scope.meter = {
            name    : "",
            url     : "",
            username: "",
            password: "",
            type    : 1
        };

        groupDb.getGroup($routeParams.groupName, function(g){
            if (g != null){

                $scope.group = g;

                log('meterId', $scope.meterId);
                if ($scope.meterId){
                    _.each($scope.group.meters, function(meter){
                        if (meter._id == $scope.meterId){
                            $scope.meter = meter;
                        }
                    });
                }

                getIsGroupAdmin(account.user()._id, $scope.group._id);
            } else {
                $location.path("/home");
            }
        });



        $scope.addMeter = function(meter, groupId){
            groupDb.addMeter(meter, groupId, function(result){
                log("add member result: ", result);
                if (result){
                    history.back();
                } else {
                    $scope.isShowError = true;
                }
            });
        }

        $scope.checkIsMeterNameExist = function(meter, groupId){
            groupDb.isMeterNameExist(meter.name, meter._id, groupId, function(result){
                log("is meter name exist result: ", result);
                $scope.isMeterNameExist = result;
            });
        }

        function getIsGroupAdmin(userId, groupId) {
            groupDb.isGroupAdmin(userId, groupId, function(isAdminResult){
                if (isAdminResult != null) {
                    $scope.isGroupAdmin = isAdminResult;
                }
            });
        }

        $scope.account = account;
    }
]);

