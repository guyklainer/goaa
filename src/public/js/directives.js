'use strict';

/* Directives */

//
//angular.module('App').directive('logoff', ['$http', '$location', function($http, $location) {
//    return function(scope, element, attrs) {
//        log('directive');
//        log(element);
//        element.bind('click',function(){
//            log("logout click");
//            $http.post('/logout', {})
//                .error(function(data, status, headers, config){
//                    httpErrorCallback(data, status, headers, config);
//                })
//                .success(function(data, status, headers, config) {
//                    log("logout success");
//                    log(data);
//                    $location.path('/');
//                });
//        });
//    };
//  }]);


//var INTEGER_REGEXP = /^\-?\d*$/;
//angular.module('App',[]).directive('integer', function() {
//    return {
//        require: 'ngModel',
//        link: function(scope, elm, attrs, ctrl) {
//            ctrl.$parsers.unshift(function(viewValue) {
//                if (INTEGER_REGEXP.test(viewValue)) {
//                    // it is valid
//                    ctrl.$setValidity('integer', true);
//                    return viewValue;
//                } else {
//                    // it is invalid, return undefined (no model update)
//                    ctrl.$setValidity('integer', false);
//                    return undefined;
//                }
//            });
//        }
//    };
//});

//// override the default input to update on blur
//angular.module('App', []).directive('ngModelOnblur', function() {
//    return {
//        restrict: 'A',
//        require: 'ngModel',
//        link: function(scope, elm, attr, ngModelCtrl) {
//            if (attr.type === 'radio' || attr.type === 'checkbox') return;
//
//            elm.unbind('input').unbind('keydown').unbind('change');
//            elm.bind('blur', function() {
//                scope.$apply(function() {
//                    ngModelCtrl.$setViewValue(elm.val());
//                });
//            });
//        }
//    };
//});
