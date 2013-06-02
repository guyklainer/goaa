"use strict";

app.factory('socketIO', [ function(){
    var socket = io.connect( "http://localhost:3001" );

    // Public API here
    return {
        socket: socket
    };
}]);
