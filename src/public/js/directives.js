'use strict';

/* Directives */

//
//angular.module('myApp.directives', []).
//  directive('appVersion', ['version', function(version) {
//    return function(scope, elm, attrs) {
//      elm.text(version);
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
