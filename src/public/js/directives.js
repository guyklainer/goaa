'use strict';

/* Directives */


angular.module('App').directive('username', [function() {
//    return function(scope, element, attrs) {
        return {
            restrict: 'E',
            scope: {
                account: "="
            },
            //transclude: true,
            template: '<span>{{account.user().firstName}}</span>'
//            link: function(scope, element, attrs) {
//                // edit mode boolean controls the visibilty of the blink and input
//                log('username directive');
//                log(element);
//                //scope.editMode = false;
//                // called when the marquee tag is clicked
////                scope.edit = function() {
////                    scope.editMode = true;
////                };
//            }
        };
//    };
  }]);


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
