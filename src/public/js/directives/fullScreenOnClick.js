'use strict';

app.directive('fullScreenOnClick', function($timeout) {
    return {
        link: function(scope, element, attrs, controller){

            if (element.length == 1){
                $(element[0]).click(function(){
                    launchFullScreen(element[0]);
                });
            }
        }
    };

    // Find the right method, call on correct element
    function launchFullScreen(element) {
        if(element.requestFullScreen) {
            element.requestFullScreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }
});