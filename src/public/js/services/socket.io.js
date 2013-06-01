"use strict";

app.factory('socketIO', [ function(){
    var socket = io.connect();

    // Public API here
    return {
        socket: socket
    };
}]);
