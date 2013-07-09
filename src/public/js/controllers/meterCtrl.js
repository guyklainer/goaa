"use strict";

angular.module('App').controller('MeterCtrl', ['$scope', 'blockui', '$http', '$location', 'account', 'groupDb', '$routeParams', '$timeout',
    function( $scope, blockui, $http, $location, account, groupDb, $routeParams ){

        log($routeParams.groupName);
        log($routeParams.meter);

        $scope.groupName        = $routeParams.groupName;
        $scope.showBottomMenu   = true;
        $scope.meter            = {
            status  :   'off',
            data    :   20
        }

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
            log(meter);
            $scope.socket = io.connect();
            $scope.socket.emit( 'connect', meter );

            $scope.socket.on( 'invalid', function( data ){
                $scope.authError = data.field;
                $scope.$apply();
            });

            $scope.socket.on( 'data', function( data ){
                $scope.meter = data;
                $scope.$apply();
            });

            $scope.updateServer = function(){
                $scope.socket.emit( 'status', $scope.meter.status );
            }
        }

        $scope.isOn = function(){
            if ( $scope.meter.status == "on" ){
                return "btn-danger";

            } else {
                return "";
            }
        }

        $scope.account = account;
    }]);
