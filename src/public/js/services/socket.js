"use strict";

angular.module('App').factory('socket', ['$rootScope', function( $rootScope ){

    $rootScope.socket = io.connect();
    var sockets = [];

    var connect = function( data ) {
        if( sockets.indexOf( data.name ) == -1 ){
            emit( "connect", data );
            sockets.push( data.name );
            return false;

        } else {
            return true;
        }
    };

    var disconnect = function(){
        if( $rootScope.socket ){
            $rootScope.socket.emit( 'close' );
        }
    };

    var on = function ( eventName, callback ) {
        $rootScope.socket.on( eventName, function(){
            var args = arguments;

            $rootScope.$apply(function(){
                callback.apply( $rootScope.socket, args );
            });
        });
    };

    var emit = function ( eventName, data, callback ){
        $rootScope.socket.emit( eventName, data, function(){
            var args = arguments;

            $rootScope.$apply( function (){
                if ( callback ){
                    callback.apply( $rootScope.socket, args );
                }
            });
        });
    };

    // Public API
    return {
        connect : connect,
        on      : on,
        emit    : emit,
        clear   : disconnect
    };
}]);