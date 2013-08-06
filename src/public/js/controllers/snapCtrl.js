"use strict";

angular.module('App').controller('SnapCtrl', ['$scope', '$location', '$route', '$timeout', 'contextService',
    function($scope, $location, $route, $timeout, contextService){

    // public var
    $scope.menu = "home";

    // when group model changes -> update $scope.group
    $scope.$watch( function () { return contextService.group.val; },
        function ( val ) {
            $scope.group = val;
        }, true);

    // when groups model changes -> update $scope.groups
    $scope.$watch( function () { return contextService.groups.val; },
        function ( val ) {
            $scope.groups = val;
            log('change groups', $scope.groups);
        }, true);


    // public functions
    $scope.gotoCreateGroup = function(){
        $location.path("/createGroup");
    };
    $scope.gotoJoinGroup = function(){
        $location.path("/joinGroup");
    };
    $scope.gotoComposePost = function(){
        $location.path("/compose");
    };
    $scope.gotoGroupSettings = function(){
        $location.path('group/' + $scope.group.name + '/settings');
    };

    // when location change -> change to the correct menu
    $scope.$watch( function () { return $location.path(); },
        function ( val ) {
            if ($location.path().indexOf('/group') != -1) { // case in group
                $scope.menu = "group";
            } else {
                $scope.menu = "home";
            }
        }, true);
}]);
