"use strict";

angular.module('App').controller('MeterCtrl', ['$scope', 'blockui', '$http', '$location', 'account', 'groupDb', '$routeParams', 'socket',
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
                    $scope.meter._id    = meter._id;
                    $scope.meter.type   = meter.type;

                    $scope.startConnection( meter );
                }
            });
        });

        $scope.startConnection = function( meter ){

            var exist = socket.connect( meter );

            if( exist )
                socket.emit( "update", meter );

            socket.on( 'invalid', function( data ){
                if( data._id == meter._id )
                    $scope.authError = data.field;
            });

            socket.on( 'data', function( data ){
                if( data._id.indexOf( meter._id ) != -1 ) {
                    $scope.meter.data   = data.data;
                    $scope.meter.temp   = data.temp;
                    $scope.meter.status = data.status;
                }
            });

            $scope.updateServer = function(){
                socket.emit( 'status', $scope.meter );
                socket.emit( 'temp', $scope.meter );
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
