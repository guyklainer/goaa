"use strict";

angular.module('App').controller('MeterCtrl', ['$scope', 'blockui', '$http', '$location', 'account', 'groupDb', '$routeParams', 'socket', '$timeout',
    function( $scope, blockui, $http, $location, account, groupDb, $routeParams, socket ){

        log($routeParams.groupName);
        log($routeParams.meter);
        $scope.groupName        = $routeParams.groupName;
        $scope.showBottomMenu   = true;
        $scope.meter            = {
            status  :   'off',
            data    :   20,
            name    :   $routeParams.meter
        };

        groupDb.getGroup( $routeParams.groupName, function( group ){
            $scope.isLoading = false;
            $scope.group = group;

            _.each( group.meters, function( meter ){

                if( meter.name == $routeParams.meter ){
                    $scope.startConnection( meter );
                }
            });
        });

        $scope.startConnection = function( meter ){

            var exist = socket.connect( meter );

            if( exist )
                socket.emit( meter.name + "-update" );

            socket.on( meter.name + '-invalid', function( data ){
                $scope.authError = data.field;
            });

            socket.on( meter.name + '-data', function( data ){
                $scope.meter = data;
            });

            $scope.updateServer = function(){
                socket.emit( meter.name + '-status', $scope.meter.status );
            }
        };

        $scope.isOn = function(){
            if ( $scope.meter.status == "on" ){
                return "btn-danger";

            } else {
                return "";
            }
        };

        $scope.account = account;
    }]);
