"use strict";

app.directive('hiddenWhenInputFocus', function($timeout) {
    function bindEvents(element) {
        $("input").blur(function () {
            log('blur');
            $(element).show();
        });
        $("textarea").blur(function () {
            log('blur');
            $(element).show();
        });
        $("input").focus(function () {
            log('focus');
            $(element).hide();
        });
        $("textarea").focus(function () {
            log('focus');
            $(element).hide();
        });
    }

    return {
        link: function(scope, element, attrs, controller){
            scope.$on('event:hideBottom', function() {
                log('event:hideBottom -> binding events');
                bindEvents(element);
            });

            bindEvents(element);
        }
    }
});