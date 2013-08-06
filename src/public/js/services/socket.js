"use strict";

angular.module('App').factory('socket', ['$rootScope', function( $rootScope ){

    var socket  = io.connect(),
        sockets = [];

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
        if( socket ){
            socket.emit( 'close' );
        }
    };

    var on = function ( eventName, callback ) {
        socket.on( eventName, function(){
            var args = arguments;

            $rootScope.$apply(function(){
                callback.apply( socket, args );
            });
        });
    };

    var emit = function ( eventName, data, callback ){
        socket.emit( eventName, data, function(){
            var args = arguments;

            $rootScope.$apply( function (){
                if ( callback ){
                    callback.apply( socket, args );
                }
            });
        });
    };


    // Public API
    return {
        connect     : connect,
        on          : on,
        emit        : emit,
        clear       : disconnect
    };
}]);