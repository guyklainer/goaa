'use strict';

app.directive('groupHeader', function($location) {
    return {
        templateUrl: "/template/directives/groupHeader.html",
        replace: true,
        scope: {
            view: "=",
            groupName: "="
        },
        link: function(scope, element, attrs, controller){
            log("link group header", scope);

            scope.activePage       = scope.view ? scope.view.toLocaleLowerCase() : 'posts';
            scope.partialEnum      = {
                gallery : 'gallery',
                meters  : 'meters',
                todos   : 'todos',
                posts   : 'posts'
            };

            scope.gotoPartial = function(partialEnumItem){
                var index   = $location.path().indexOf(scope.view),
                    url     = $location.path().substr(0, index-1);

                if( partialEnumItem == 'posts' ){
                    $location.path( url );

                } else {
                    if (scope.view == undefined || scope.view == null){
                        $location.path( $location.path() + '/' + partialEnumItem );

                    } else if (scope.view.toLowerCase() != partialEnumItem){
                        $location.path( url + '/' + partialEnumItem );
                    }
                }
                scope.activePage = partialEnumItem;
            }

            scope.gotoComposePost = function(){
                $location.path("compose/" + scope.groupName);
            }
        }
    };
});