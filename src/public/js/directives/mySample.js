'use strict';

app.directive('mySample', function() {
    return {
        templateUrl: "/template/directives/mySample.html"
//        link: function(scope, element, attrs, controller){
//            var markup = "<input type='text' ng-model='sampleData' /> {{sampleData}} <br/>";
//            angular.element(element).html(markup);
//        }
    };
});