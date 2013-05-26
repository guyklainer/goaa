"use strict";

app.directive('galleryThumb', function($timeout) {
    return {
        templateUrl: "/template/directives/galleryThumb.html",
        replace: true,
        scope: {
            posts: "="
        },
        link: function(scope, element, attrs, controller){
        }
    }
});