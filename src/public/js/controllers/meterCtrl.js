"use strict";

angular.module('App').controller('MeterCtrl', ['$scope', 'blockui', '$http', '$location', 'account', 'groupDb', '$routeParams', '$timeout',
    function($scope, blockui, $http, $location, account, groupDb, $routeParams, $timeout){

        log($routeParams.groupName);
        log($routeParams.meter);

        $scope.showBottomMenu   = true;
        $scope.groupName        = $routeParams.groupName;
        $scope.meterName        = $routeParams.meter;
        $scope.boiler           = {
            status  :   'off',
            data    :   20
        }

//        var socket = io.connect();
//
//        socket.on( 'boiler', function( boiler ){
//            $scope.boiler = boiler;
//
//            $('.switch').bootstrapSwitch('setState', $scope.boiler.status == "on" );
//
//            $scope.$apply();
//        });
//
//        $( '.switch' ).on( 'switch-change', function ( e, data ) {
//            var $el = $( data.el )
//                , value = data.value;
//
//            var changeTo    = value ? 'on' : 'off';
//
//            $scope.boiler.status = changeTo;
//            socket.emit( 'status', changeTo );
//
//        });

        $timeout(function(){
            $scope.boiler.data = 55;
        },2000);


        $scope.getTempClass = function(){
            if ( $scope.boiler.data >= 20 && $scope.boiler.data < 45 ){
                return "blue";
            } else {
                return "red";
            }
        }

        $scope.isOn = function(){
            if ( $scope.boiler.status == "on" ){
                return "btn-danger";

            } else {
                return "";
            }
        }

        $scope.isOff = function(){
            if ( $scope.boiler.status == "off" ){
                return "btn-primary";

            } else {
                return "";
            }
        }

        $scope.account = account;
    }]);
