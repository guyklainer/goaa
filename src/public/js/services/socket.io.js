"use strict";

app.factory('socketIO', [ function(){

    // Public API here
    return {
        connect: function( params ){
            var socket = io.connect();

            socket.emit( 'connect', { username: params.username, password: params.password } );
            return socket;
        }
    };
}]);
