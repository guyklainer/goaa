"use strict";

angular.module('App').factory('blockui', ['$dialog', function($dialog){

    var diagOptions = {
            backdrop: true,
            keyboard: false,
            backdropClick: false,
            templateUrl:  'partials/blockui.ejs'
        },
        blockui = $dialog.dialog(diagOptions)
        ,
        isOpen = false
        ,
        timeout = 15 * 1000 // in millisec
        ,
        block = function() {
            log("block");
            if (isOpen) {
                log("modal allready opened");
            } else {
                blockui.open();
                isOpen = true;

                // unblock after timeout
                setTimeout(function() {
                    if (isOpen) {
                        log("timeout over - unblocking");
                        unblock();
                    }
                }, timeout);
            }
        }
        ,
        unblock = function(){
            log("unblock");
            blockui.close();
            isOpen = false;
        };


    // Public API here
    return {
        block: block,
        unblock: unblock
    };
}]);