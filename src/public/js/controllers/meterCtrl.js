"use strict";

angular.module('App').controller('MeterCtrl', ['$scope', 'blockui', '$http', '$location', 'account', 'groupDb', '$routeParams', '$timeout',
    function($scope, blockui, $http, $location, account, groupDb, $routeParams, $timeout){

        log($routeParams.groupName);
        log($routeParams.meter);

        $scope.groupName = $routeParams.groupName;
        $scope.meterName = $routeParams.meter;
        $scope.temperature = 20;

        $timeout(function(){
            $scope.temperature = 30;
        },2000);


        $scope.getTempClass = function(temperature){
            if (temperature >= 0 && temperature < 25){
                return "green";
            } else {
                return "red";
            }
        }

        $scope.account = account;
    }]);
