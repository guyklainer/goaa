"use strict";

app.directive('reAuth', function($location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller){
            //once Angular is started, remove class:
//            elem.removeClass('reAuth');

            var login = element.find('#login-holder');
            var main = element.find('#content');
            var isInLogin = $location.path().indexOf('login') != -1;
            log('login elements', login, main);

            login.hide();

            scope.$on('event:auth-loginRequired', function() {
                NProgress.done();
                if (isInLogin){
                    login.slideDown('slow', function() {
                        main.hide();
                    });
                }
            });
            scope.$on('event:auth-loginConfirmed', function() {
                if (isInLogin) {
                    main.show();
                    login.slideUp();
                }
            });
        }
    }
});