"use strict";

angular.module('App').factory('blockui', ['$dialog', '$timeout', function($dialog, $timeout){

    var diagOptions = {
            backdrop: true,
            keyboard: false,
            backdropClick: false,
            templateUrl:  '/partials/blockui.ejs'
        },
        blockui = $dialog.dialog(diagOptions)
        ,
        timeout = 15 * 1000 // in millisec
        ,
        block = function() {
            log("block");
            if (blockui.isOpen()) {
                log("modal allready opened");
            } else {
                blockui.open();

                // unblock after timeout
                setTimeout(function() {
                    if (blockui.isOpen()) {
                        log("timeout over - unblocking");
                        unblock();
                    }
                }, timeout);
            }
        }
        ,
        unblock = function(){
            log("unblock");

            var delayInMiliSec = 500;

            $timeout(function(){
                if (blockui.isOpen()){
                    blockui.close();
                }
            }, delayInMiliSec);

        };


    // Public API here
    return {
        block: block,
        unblock: unblock
    };
}]);