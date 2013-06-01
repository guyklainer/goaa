"use strict";

angular.module('App').controller('MeterCtrl', ['$scope', 'blockui', '$http', '$location', 'account', 'groupDb', 'socketIO', '$routeParams', '$timeout',
    function( $scope, blockui, $http, $location, account, groupDb, $socketIO, $routeParams ){

        log($routeParams.groupName);
        log($routeParams.meter);

        $scope.groupName        = $routeParams.groupName;
        $scope.showBottomMenu   = true;
        $scope.boiler           = {
            status  :   'off',
            data    :   20
        }

        groupDb.getGroup( $routeParams.groupName, function( group ){
            $scope.isLoading = false;
            $scope.group = group;

            _.each( group.meters, function( meter ){

                if( meter.name == $routeParams.meter ){
                    $scope.currentMeter = meter;
                    $scope.startConnection( meter );

                }
            });


        });

        $scope.startConnection = function( meter ){
            log(meter);
            $scope.socket = $socketIO.socket;

            $scope.socket.emit( 'connect', { username: meter.username, password: meter.password } );

            $scope.socket.on( 'invalid', function( data ){
                $scope.authError = data.field;
                log(data);
            });

            $scope.socket.on( 'invalid', function( data ){
                $scope.authError = data.field;
                $scope.$apply();
                $scope.socket.emit( 'disconnect' );
                log(data);
            });

            $scope.socket.on( 'boiler', function( boiler ){
                $scope.boiler = boiler;
                $scope.$apply();
            });

            $scope.updateServer = function(){
                $scope.socket.emit( 'status', $scope.boiler.status );
            }
        }

        $scope.isOn = function(){
            if ( $scope.boiler.status == "on" ){
                return "btn-danger";

            } else {
                return "";
            }
        }

        $scope.account = account;
    }]);
