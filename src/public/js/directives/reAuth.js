"use strict";

app.directive('reAuth', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller){
            //once Angular is started, remove class:
//            elem.removeClass('reAuth');

            var login = element.find('#login-holder');
            var main = element.find('#content');
            log('login elements', login, main);

            login.hide();

            scope.$on('event:auth-loginRequired', function() {
                login.slideDown('slow', function() {
                    main.hide();
                });
            });
            scope.$on('event:auth-loginConfirmed', function() {
                main.show();
                login.slideUp();
            });
        }
    }
});